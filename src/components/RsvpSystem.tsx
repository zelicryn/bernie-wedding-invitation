"use client";

import React, { useState } from 'react';

interface GuestResult {
  id: string;
  name: string;
  seats: number;
  status: string; // PENDING, CONFIRMED, DECLINED
  attendingCount: number;
  accompanyingNames?: string | null;
  notes?: string | null;
  email?: string | null;
  phone?: string | null;
}

export default function RsvpSystem({ rsvpDeadline }: { rsvpDeadline?: string }) {
  const [searchName, setSearchName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GuestResult[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  const [rsvpData, setRsvpData] = useState({
    attending: true,
    attendingCount: 1,
    accompanyingNames: "",
    notes: "",
    phone: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setIsSearching(true);
    setErrorMessage("");
    setSelectedGuest(null);
    setSubmitSuccess(false);
    setIsEditingExisting(false);

    try {
      const res = await fetch(`/api/guests/search?name=${encodeURIComponent(searchName.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to search guest list');
      }

      if (!data.matches || data.matches.length === 0) {
        setSearchResults([]);
        setErrorMessage("We could not find your name on the guest list. Please check the spelling or contact Sandy & Bernadette directly.");
      } else if (data.matches.length === 1) {
        selectGuest(data.matches[0]);
      } else {
        setSearchResults(data.matches);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectGuest = (guest: GuestResult) => {
    setSelectedGuest(guest);
    setSearchResults([]);
    setErrorMessage("");

    setRsvpData({
      attending: guest.status !== 'DECLINED',
      attendingCount: guest.attendingCount > 0 ? guest.attendingCount : 1,
      accompanyingNames: guest.accompanyingNames || "",
      notes: guest.notes || "",
      phone: guest.phone || "",
    });

    if (guest.status !== 'PENDING') {
      setIsEditingExisting(false);
    } else {
      setIsEditingExisting(true);
    }
  };

  const submitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch('/api/guests/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: selectedGuest.id,
          status: rsvpData.attending ? 'CONFIRMED' : 'DECLINED',
          attendingCount: rsvpData.attending ? rsvpData.attendingCount : 0,
          accompanyingNames: rsvpData.attending && rsvpData.attendingCount > 1 ? rsvpData.accompanyingNames : '',
          notes: rsvpData.notes,
          phone: rsvpData.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit RSVP');

      setSelectedGuest(data.guest);
      setSubmitSuccess(true);
      setIsEditingExisting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSearch = () => {
    setSelectedGuest(null);
    setSearchResults([]);
    setSearchName("");
    setSubmitSuccess(false);
    setErrorMessage("");
    setIsEditingExisting(false);
  };

  return (
    <section id="rsvp" className="section-padding container" style={{ maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span
          style={{
            color: 'var(--accent-red)',
            fontWeight: 700,
            letterSpacing: '3px',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '0.5rem',
          }}
        >
          Your Presence is Our Joy
        </span>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          RSVP Portal
        </h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--gray-light)', fontStyle: 'italic' }}>
          Please search your name below to view your invitation and reserved seats.
        </p>
        {rsvpDeadline && (
          <p style={{ marginTop: '0.6rem', color: 'var(--accent-red)', fontSize: '0.9rem', fontWeight: 600 }}>
            Kindly respond on or before {rsvpDeadline}
          </p>
        )}
      </div>

      {/* Search Input Box */}
      {!selectedGuest && searchResults.length === 0 && (
        <div
          className="fade-in"
          style={{
            background: 'var(--gray-dark)',
            padding: '2.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-medium)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          }}
        >
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
              Full Name (As written on your invitation)
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="e.g. Maria Santos, Juan Cruz"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={{
                  flex: '1 1 280px',
                  padding: '1rem 1.2rem',
                  fontSize: '1.1rem',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--gray-medium)',
                  color: 'white',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
                required
              />
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary"
                style={{ flex: '0 0 auto', minWidth: '160px', opacity: isSearching ? 0.7 : 1 }}
              >
                {isSearching ? (
                  <span>Checking...</span>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    FIND MY RSVP
                  </>
                )}
              </button>
            </div>
          </form>

          {errorMessage && (
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '6px',
                background: 'rgba(229, 9, 20, 0.15)',
                border: '1px solid rgba(229, 9, 20, 0.4)',
                color: '#ff8a8a',
                fontSize: '0.95rem',
                lineHeight: 1.5,
              }}
            >
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Multiple Matches Selection */}
      {!selectedGuest && searchResults.length > 0 && (
        <div
          className="fade-in"
          style={{
            background: 'var(--gray-dark)',
            padding: '2.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-medium)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              We found {searchResults.length} matching names:
            </h3>
            <button onClick={resetSearch} style={{ background: 'none', border: 'none', color: 'var(--gray-light)', cursor: 'pointer' }}>
              ← Try another name
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {searchResults.map((guest) => (
              <div
                key={guest.id}
                onClick={() => selectGuest(guest)}
                style={{
                  padding: '1.2rem',
                  background: 'rgba(255,255,255,0.04)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-red)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff' }}>{guest.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', margin: 0 }}>
                    Seats reserved: {guest.seats} {guest.status !== 'PENDING' ? `• Currently: ${guest.status}` : ''}
                  </p>
                </div>
                <button className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Guest RSVP Card */}
      {selectedGuest && (
        <div
          className="fade-in"
          style={{
            background: 'var(--gray-dark)',
            padding: '2.5rem',
            borderRadius: '12px',
            border: '1px solid var(--gray-medium)',
            boxShadow: '0 15px 50px rgba(0,0,0,0.7)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(229, 9, 20, 0.2)',
                  color: 'var(--accent-red)',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Personal Invitation
              </span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>
                Welcome, {selectedGuest.name}!
              </h3>
            </div>
            <button
              onClick={resetSearch}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--gray-light)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline',
              }}
            >
              Search different guest
            </button>
          </div>

          {/* Seat Allocation Badge */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(229, 9, 20, 0.15) 0%, rgba(20,20,20,0.6) 100%)',
              borderLeft: '4px solid var(--accent-red)',
              padding: '1.2rem 1.5rem',
              borderRadius: '0 8px 8px 0',
              marginBottom: '2rem',
            }}
          >
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Seats reserved in your honor:{' '}
              <span style={{ color: 'var(--accent-red)', fontSize: '1.5rem', fontWeight: 800 }}>
                {selectedGuest.seats}
              </span>{' '}
              {selectedGuest.seats > 1 ? 'seats' : 'seat'}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', margin: '4px 0 0' }}>
              We have specifically reserved {selectedGuest.seats > 1 ? 'these seats' : 'this seat'} for you.
            </p>
          </div>

          {/* Already RSVP'd display (if not currently editing) */}
          {!isEditingExisting && selectedGuest.status !== 'PENDING' && (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              {selectedGuest.status === 'CONFIRMED' ? (
                <div
                  style={{
                    background: 'rgba(46, 125, 50, 0.15)',
                    border: '1px solid rgba(46, 125, 50, 0.4)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ marginBottom: '0.75rem', color: '#81c784', display: 'flex', justifyContent: 'center' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#81c784', marginBottom: '0.5rem' }}>
                    Your RSVP is Confirmed!
                  </h4>
                  <p style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>
                    Attending: <strong>{selectedGuest.attendingCount}</strong> guest(s)
                  </p>
                  {selectedGuest.accompanyingNames && (
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
                      Companions: <strong>{selectedGuest.accompanyingNames}</strong>
                    </p>
                  )}
                  {submitSuccess && (
                    <p style={{ color: '#81c784', marginTop: '0.8rem', fontWeight: 600 }}>
                      Thank you! We can't wait to celebrate with you!
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    background: 'rgba(229, 9, 20, 0.15)',
                    border: '1px solid rgba(229, 9, 20, 0.4)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ff8a8a', marginBottom: '0.5rem' }}>
                    RSVP Response: Unable to attend
                  </h4>
                  <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', margin: 0 }}>
                    We will miss you on our special day! Thank you for letting us know.
                  </p>
                </div>
              )}

              <button
                onClick={() => setIsEditingExisting(true)}
                className="btn-secondary"
                style={{ fontSize: '0.95rem', padding: '0.7rem 1.8rem' }}
              >
                Change or Update RSVP
              </button>
            </div>
          )}

          {/* RSVP Form (when PENDING or editing) */}
          {(isEditingExisting || selectedGuest.status === 'PENDING') && (
            <form onSubmit={submitRsvp} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: 600, fontSize: '1.05rem' }}>
                  Will you be attending?
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, attending: true })}
                    className={rsvpData.attending ? "btn-primary" : "btn-secondary"}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      border: rsvpData.attending ? '2px solid #fff' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>YES, I WILL ATTEND</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Joyfully accepts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpData({ ...rsvpData, attending: false })}
                    className={!rsvpData.attending ? "btn-primary" : "btn-secondary"}
                    style={{
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      border: !rsvpData.attending ? '2px solid #fff' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>SORRY, I CAN'T ATTEND</span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Regretfully declines</span>
                  </button>
                </div>
              </div>

              {rsvpData.attending && (
                <>
                  {selectedGuest.seats > 1 && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Number of attendees (including you):
                      </label>
                      <select
                        value={rsvpData.attendingCount}
                        onChange={(e) => setRsvpData({ ...rsvpData, attendingCount: parseInt(e.target.value) })}
                        style={{
                          width: '100%',
                          padding: '0.9rem',
                          backgroundColor: 'var(--gray-medium)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          fontSize: '1rem',
                        }}
                      >
                        {Array.from({ length: selectedGuest.seats }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedGuest.seats > 1 && rsvpData.attendingCount > 1 && (
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Name(s) of accompanying guest(s):
                      </label>
                      <textarea
                        placeholder="Please specify full name(s) of companion(s)..."
                        value={rsvpData.accompanyingNames}
                        onChange={(e) => setRsvpData({ ...rsvpData, accompanyingNames: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.9rem',
                          backgroundColor: 'var(--gray-medium)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '6px',
                          minHeight: '80px',
                          fontFamily: 'inherit',
                          fontSize: '1rem',
                        }}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                      Mobile Phone / Contact Number:
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0917 123 4567"
                      value={rsvpData.phone}
                      onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        backgroundColor: 'var(--gray-medium)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '6px',
                        fontSize: '1rem',
                      }}
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Message or Wishes for the Couple (Optional):
                </label>
                <textarea
                  placeholder="Share a wish, prayer, or special note for Sandy & Bernadette..."
                  value={rsvpData.notes}
                  onChange={(e) => setRsvpData({ ...rsvpData, notes: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    backgroundColor: 'var(--gray-medium)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    minHeight: '80px',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                  }}
                />
              </div>

              {errorMessage && (
                <div style={{ color: '#ff8a8a', fontSize: '0.95rem' }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  fontSize: '1.15rem',
                  letterSpacing: '1px',
                  fontWeight: 700,
                  opacity: isSubmitting ? 0.7 : 1,
                }}
              >
                {isSubmitting ? 'CONFIRMING RSVP...' : 'SUBMIT MY RSVP'}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
