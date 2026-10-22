"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Guest {
  id: string;
  name: string;
  seats: number;
  status: string;
  attendingCount: number;
  accompanyingNames?: string | null;
  notes?: string | null;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
}

interface Sponsor {
  id: string;
  name: string;
  gender: string;
  partnerName?: string | null;
  role: string;
  photoUrl?: string | null;
  order: number;
}

interface GiftItem {
  id: string;
  type: string;
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  qrCodeUrl?: string | null;
  note?: string | null;
  order: number;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

interface EpisodeItem {
  id: string;
  title: string;
  date?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  order: number;
}

interface EntourageItem {
  id: string;
  name: string;
  role: string;
  photoUrl?: string | null;
  order: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'guests' | 'photos' | 'sponsors' | 'gifts' | 'faqs' | 'episodes' | 'entourage'>('guests');

  // Loading states & alerts
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guests State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestStats, setGuestStats] = useState({
    totalGuests: 0,
    totalSeatsAllocated: 0,
    confirmedCount: 0,
    totalConfirmedAttendees: 0,
    declinedCount: 0,
    pendingCount: 0,
  });
  const [guestSearch, setGuestSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestSeats, setNewGuestSeats] = useState(1);
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  // Editing single guest inline/modal
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Settings State (Photos & Texts)
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Sponsors State
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [newSponsor, setNewSponsor] = useState({ name: '', gender: 'MALE', partnerName: '', photoUrl: '' });

  // Gifts State
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [newGift, setNewGift] = useState({ type: 'GCash', bankName: 'GCash', accountName: '', accountNumber: '', qrCodeUrl: '', note: '' });

  // FAQs State
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  // Episodes & Entourage
  const [episodes, setEpisodes] = useState<EpisodeItem[]>([]);
  const [newEpisode, setNewEpisode] = useState({ title: '', date: '', description: '', photoUrl: '' });
  const [entourage, setEntourage] = useState<EntourageItem[]>([]);
  const [newEntourage, setNewEntourage] = useState({ name: '', role: '', photoUrl: '' });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check session storage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('berny_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Incorrect PIN');

      sessionStorage.setItem('berny_admin_auth', 'true');
      setIsAuthenticated(true);
      loadAllAdminData();
    } catch (err: any) {
      setAuthError(err.message || 'Invalid PIN. (Default is 1234)');
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchGuests(),
        fetchSettings(),
        fetchSponsors(),
        fetchGifts(),
        fetchFaqs(),
        fetchEpisodes(),
        fetchEntourage(),
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- API FETCHERS ---
  const fetchGuests = async () => {
    try {
      const res = await fetch('/api/admin/guests');
      const data = await res.json();
      if (data.guests) setGuests(data.guests);
      if (data.stats) setGuestStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSponsors = async () => {
    try {
      const res = await fetch('/api/admin/sponsors');
      const data = await res.json();
      if (data.sponsors) setSponsors(data.sponsors);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchGifts = async () => {
    try {
      const res = await fetch('/api/admin/gifts');
      const data = await res.json();
      if (data.gifts) setGifts(data.gifts);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (data.faqs) setFaqs(data.faqs);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const res = await fetch('/api/admin/episodes');
      const data = await res.json();
      if (data.episodes) setEpisodes(data.episodes);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchEntourage = async () => {
    try {
      const res = await fetch('/api/admin/entourage');
      const data = await res.json();
      if (data.entourage) setEntourage(data.entourage);
    } catch (e) {
      console.error(e);
    }
  };

  // --- IMAGE UPLOAD HELPER ---
  const handleFileUpload = async (file: File, onDone: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onDone(data.url);
      showToast('Image uploaded successfully!');
    } catch (err: any) {
      alert(err.message || 'Image upload error');
    }
  };

  // --- GUEST HANDLERS ---
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newGuestName.trim(),
          seats: Number(newGuestSeats) || 1,
          phone: newGuestPhone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNewGuestName('');
      setNewGuestSeats(1);
      setNewGuestPhone('');
      fetchGuests();
      showToast('Guest added to invitation list!');
    } catch (err: any) {
      alert(err.message || 'Error adding guest');
    }
  };

  const handleBulkAddGuests = async () => {
    if (!bulkInput.trim()) return;
    const lines = bulkInput.split('\n').filter((l) => l.trim().length > 0);
    const bulkGuests = lines.map((line) => {
      const parts = line.split(',');
      const name = parts[0]?.trim();
      const seats = parts[1] ? Number(parts[1].trim()) : 2;
      return { name, seats: isNaN(seats) || seats < 1 ? 2 : seats };
    });

    try {
      const res = await fetch('/api/admin/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bulkGuests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBulkInput('');
      setShowBulkAdd(false);
      fetchGuests();
      showToast(`Successfully added ${data.count} guests!`);
    } catch (err: any) {
      alert(err.message || 'Failed to bulk add guests');
    }
  };

  const handleUpdateGuest = async (guest: Guest) => {
    try {
      const res = await fetch('/api/admin/guests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guest),
      });
      if (!res.ok) throw new Error('Update failed');
      setEditingGuest(null);
      fetchGuests();
      showToast('Guest updated!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleDeleteGuest = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the invited list?`)) return;
    try {
      await fetch(`/api/admin/guests?id=${id}`, { method: 'DELETE' });
      fetchGuests();
      showToast('Guest removed.');
    } catch (e) {
      console.error(e);
    }
  };

  // --- SETTINGS (PHOTOS & TEXTS) HANDLER ---
  const handleSaveSettings = async (updates: Record<string, string>) => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSettings((prev) => ({ ...prev, ...updates }));
      showToast('Invitation settings & photos saved!');
    } catch (e: any) {
      alert(e.message);
    }
  };

  // --- SPONSORS HANDLERS ---
  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSponsor.name.trim()) return;
    try {
      await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSponsor, order: sponsors.length + 1 }),
      });
      setNewSponsor({ name: '', gender: 'MALE', partnerName: '', photoUrl: '' });
      fetchSponsors();
      showToast('Principal sponsor added!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm('Remove this sponsor?')) return;
    await fetch(`/api/admin/sponsors?id=${id}`, { method: 'DELETE' });
    fetchSponsors();
    showToast('Sponsor removed.');
  };

  // --- GIFTS HANDLERS ---
  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/admin/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newGift, order: gifts.length + 1 }),
      });
      setNewGift({ type: 'GCash', bankName: 'GCash', accountName: '', accountNumber: '', qrCodeUrl: '', note: '' });
      fetchGifts();
      showToast('Gift option added!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGift = async (id: string) => {
    if (!confirm('Remove this gift option?')) return;
    await fetch(`/api/admin/gifts?id=${id}`, { method: 'DELETE' });
    fetchGifts();
    showToast('Gift option removed.');
  };

  // --- FAQS HANDLERS ---
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    try {
      await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newFaq, order: faqs.length + 1 }),
      });
      setNewFaq({ question: '', answer: '' });
      fetchFaqs();
      showToast('FAQ added!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Remove this question?')) return;
    await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
    fetchFaqs();
    showToast('FAQ removed.');
  };

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      (g.accompanyingNames && g.accompanyingNames.toLowerCase().includes(guestSearch.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // --- LOGIN SCREEN IF NOT AUTHENTICATED ---
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #1f1f1f 0%, #111111 100%)',
          padding: '1.5rem',
        }}
      >
        <div
          className="fade-in"
          style={{
            background: 'var(--gray-dark)',
            border: '1px solid var(--gray-medium)',
            borderRadius: '16px',
            padding: '3rem 2.5rem',
            maxWidth: '420px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          }}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(229, 9, 20, 0.15)', border: '2px solid var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-red)' }}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline><path d="M16.5 7.5l2-2"></path></svg></div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
            Bride & Groom Portal
          </h1>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', marginBottom: '2rem' }}>
            Enter your 4-digit PIN to manage guests, seats, photos, and invitation details.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input
              type="password"
              maxLength={8}
              placeholder="Enter PIN (Default: 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                padding: '1rem',
                fontSize: '1.4rem',
                textAlign: 'center',
                letterSpacing: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--gray-medium)',
                color: '#fff',
                borderRadius: '8px',
                outline: 'none',
              }}
              autoFocus
              required
            />
            {authError && (
              <p style={{ color: '#ff8a8a', fontSize: '0.85rem', margin: 0 }}>
                {authError}
              </p>
            )}
            <button type="submit" className="btn-primary" style={{ padding: '0.9rem', fontSize: '1.1rem' }}>
              ACCESS WEDDING DASHBOARD
            </button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <Link href="/" style={{ color: 'var(--gray-light)', fontSize: '0.9rem', textDecoration: 'underline' }}>
              ← Return to Invitation Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e0e', color: '#fff' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--accent-red)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 600,
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--gray-medium)',
          background: 'rgba(20,20,20,0.95)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--accent-red)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '2px' }}>
            WEDDING CONTROL
          </span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
            Sandy & Bernadette
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link
            href="/"
            target="_blank"
            className="btn-secondary"
            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
          >
            View Public Invitation
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem('berny_admin_auth');
              setIsAuthenticated(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--gray-light)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1300px' }}>
        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            borderBottom: '1px solid var(--gray-medium)',
            paddingBottom: '0.8rem',
            marginBottom: '2rem',
          }}
        >
          {[
            { id: 'guests', label: 'Guest List & Seats', count: guests.length },
            { id: 'photos', label: 'Invitation Photos & Details' },
            { id: 'sponsors', label: 'Principal Sponsors (Ninongs & Ninangs)', count: sponsors.length },
            { id: 'gifts', label: 'Gift Suggestions (GCash / Maya / Bank)', count: gifts.length },
            { id: 'faqs', label: 'FAQ Questions', count: faqs.length },
            { id: 'episodes', label: 'Our Story Episodes', count: episodes.length },
            { id: 'entourage', label: 'Cast / Entourage', count: entourage.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'var(--accent-red)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                padding: '0.7rem 1.2rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  style={{
                    background: activeTab === tab.id ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.15)',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: GUEST LIST & SEAT ALLOCATION */}
        {/* ========================================================= */}
        {activeTab === 'guests' && (
          <div>
            {/* Metric Statistics Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', padding: '1.2rem', borderRadius: '10px' }}>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Invited Parties</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>{guestStats.totalGuests}</h3>
              </div>
              <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', padding: '1.2rem', borderRadius: '10px' }}>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Total Reserved Seats</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#fff' }}>{guestStats.totalSeatsAllocated}</h3>
              </div>
              <div style={{ background: 'var(--gray-dark)', border: '1px solid rgba(46, 125, 50, 0.4)', padding: '1.2rem', borderRadius: '10px' }}>
                <p style={{ color: '#81c784', fontSize: '0.85rem', textTransform: 'uppercase' }}>Confirmed Attendees</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#81c784' }}>
                  {guestStats.totalConfirmedAttendees}{' '}
                  <span style={{ fontSize: '0.9rem', color: 'var(--gray-light)', fontWeight: 400 }}>({guestStats.confirmedCount} parties)</span>
                </h3>
              </div>
              <div style={{ background: 'var(--gray-dark)', border: '1px solid rgba(229, 9, 20, 0.4)', padding: '1.2rem', borderRadius: '10px' }}>
                <p style={{ color: '#ff8a8a', fontSize: '0.85rem', textTransform: 'uppercase' }}>Declined</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#ff8a8a' }}>{guestStats.declinedCount}</h3>
              </div>
              <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', padding: '1.2rem', borderRadius: '10px' }}>
                <p style={{ color: 'var(--gray-light)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Pending Responses</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#e0e0e0' }}>{guestStats.pendingCount}</h3>
              </div>
            </div>

            {/* Actions Bar */}
            <div
              style={{
                background: 'var(--gray-dark)',
                border: '1px solid var(--gray-medium)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add New Invited Guest
              </h3>
              <form onSubmit={handleAddGuest} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '2 1 250px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>
                    Guest Full Name (What they will search in RSVP)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ninong Tony Tan / Tito John & Family"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--gray-medium)',
                      color: '#fff',
                      borderRadius: '6px',
                    }}
                    required
                  />
                </div>

                <div style={{ flex: '1 1 120px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>
                    Seats Allowed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newGuestSeats}
                    onChange={(e) => setNewGuestSeats(parseInt(e.target.value) || 1)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--gray-medium)',
                      color: '#fff',
                      borderRadius: '6px',
                    }}
                    required
                  />
                </div>

                <div style={{ flex: '1 1 160px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0917..."
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--gray-medium)',
                      color: '#fff',
                      borderRadius: '6px',
                    }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ height: '46px' }}>
                  Add Guest
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkAdd(!showBulkAdd)}
                  className="btn-secondary"
                  style={{ height: '46px' }}
                >
                  {showBulkAdd ? 'Cancel Bulk' : 'Bulk Paste Names'}
                </button>
              </form>

              {/* Bulk Add Textarea */}
              {showBulkAdd && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--gray-medium)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '6px' }}>
                    Paste guest names line by line. Optional: add a comma and seats count (e.g. <code>Tita Helen, 2</code>). Defaults to 2 seats if not specified.
                  </p>
                  <textarea
                    rows={6}
                    placeholder={"Maria Santos, 2\nJuan Cruz, 1\nTito Roberto & Family, 4\nCamille Reyes"}
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--gray-medium)',
                      color: '#fff',
                      borderRadius: '6px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    onClick={handleBulkAddGuests}
                    className="btn-primary"
                    style={{ marginTop: '8px' }}
                  >
                    Import All Listed Guests
                  </button>
                </div>
              )}
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search invited guest name or companion..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                style={{
                  flex: '1 1 300px',
                  padding: '0.8rem 1.2rem',
                  background: 'var(--gray-dark)',
                  border: '1px solid var(--gray-medium)',
                  color: '#fff',
                  borderRadius: '6px',
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['ALL', 'CONFIRMED', 'PENDING', 'DECLINED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      background: statusFilter === st ? 'var(--accent-red)' : 'var(--gray-dark)',
                      color: '#fff',
                      border: '1px solid var(--gray-medium)',
                      padding: '0.6rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Guests Table */}
            <div
              style={{
                background: 'var(--gray-dark)',
                border: '1px solid var(--gray-medium)',
                borderRadius: '12px',
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--gray-medium)', color: 'var(--gray-light)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '1rem 1.2rem' }}>NAME</th>
                    <th style={{ padding: '1rem' }}>SEATS ALLOWED</th>
                    <th style={{ padding: '1rem' }}>STATUS</th>
                    <th style={{ padding: '1rem' }}>ATTENDING COUNT</th>
                    <th style={{ padding: '1rem' }}>COMPANIONS / NOTES</th>
                    <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-light)' }}>
                        No guests found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => (
                      <tr
                        key={guest.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          transition: 'background 0.2s',
                        }}
                      >
                        <td style={{ padding: '1rem 1.2rem', fontWeight: 600, color: '#fff' }}>
                          {editingGuest?.id === guest.id ? (
                            <input
                              type="text"
                              value={editingGuest.name}
                              onChange={(e) => setEditingGuest({ ...editingGuest, name: e.target.value })}
                              style={{
                                background: '#111',
                                border: '1px solid var(--accent-red)',
                                color: '#fff',
                                padding: '4px 8px',
                                borderRadius: '4px',
                              }}
                            />
                          ) : (
                            <div>
                              <div>{guest.name}</div>
                              {guest.phone && <div style={{ fontSize: '0.75rem', color: 'var(--gray-light)' }}>{guest.phone}</div>}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          {editingGuest?.id === guest.id ? (
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={editingGuest.seats}
                              onChange={(e) => setEditingGuest({ ...editingGuest, seats: parseInt(e.target.value) || 1 })}
                              style={{
                                width: '60px',
                                background: '#111',
                                border: '1px solid var(--accent-red)',
                                color: '#fff',
                                padding: '4px',
                                borderRadius: '4px',
                              }}
                            />
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  background: 'rgba(255,255,255,0.1)',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontWeight: 700,
                                  fontSize: '0.95rem',
                                }}
                              >
                                {guest.seats} {guest.seats > 1 ? 'seats' : 'seat'}
                              </span>
                              {/* Quick +/- seat count */}
                              <button
                                onClick={() => handleUpdateGuest({ ...guest, seats: Math.max(1, guest.seats - 1) })}
                                style={{ background: '#2f2f2f', border: 'none', color: '#fff', borderRadius: '4px', width: '22px', height: '22px', cursor: 'pointer' }}
                                title="Decrease seat"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleUpdateGuest({ ...guest, seats: guest.seats + 1 })}
                                style={{ background: '#2f2f2f', border: 'none', color: '#fff', borderRadius: '4px', width: '22px', height: '22px', cursor: 'pointer' }}
                                title="Increase seat"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '1rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              letterSpacing: '1px',
                              background:
                                guest.status === 'CONFIRMED'
                                  ? 'rgba(46, 125, 50, 0.25)'
                                  : guest.status === 'DECLINED'
                                  ? 'rgba(229, 9, 20, 0.25)'
                                  : 'rgba(255, 255, 255, 0.1)',
                              color:
                                guest.status === 'CONFIRMED'
                                  ? '#81c784'
                                  : guest.status === 'DECLINED'
                                  ? '#ff8a8a'
                                  : 'var(--gray-light)',
                            }}
                          >
                            {guest.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem' }}>
                          {guest.status === 'CONFIRMED' ? (
                            <span style={{ fontWeight: 700, color: '#81c784' }}>
                              {guest.attendingCount} {guest.attendingCount > 1 ? 'guests' : 'guest'}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--gray-light)' }}>-</span>
                          )}
                        </td>

                        <td style={{ padding: '1rem', maxWidth: '280px', fontSize: '0.85rem' }}>
                          {guest.accompanyingNames && (
                            <div style={{ color: '#fff', marginBottom: '2px' }}>
                              <strong>Companions:</strong> {guest.accompanyingNames}
                            </div>
                          )}
                          {guest.notes && (
                            <div style={{ color: 'var(--gray-light)', fontStyle: 'italic' }}>
                              "{guest.notes}"
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                          {editingGuest?.id === guest.id ? (
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleUpdateGuest(editingGuest)}
                                className="btn-primary"
                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingGuest(null)}
                                className="btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => setEditingGuest(guest)}
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--gray-medium)',
                                  color: '#fff',
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                style={{
                                  background: 'none',
                                  border: '1px solid rgba(229,9,20,0.4)',
                                  color: '#ff8a8a',
                                  padding: '4px 10px',
                                  borderRadius: '4px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INVITATION PHOTOS & DETAILS (BRIDE & GROOM EDITING) */}
        {/* ========================================================= */}
        {activeTab === 'photos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
                Couple Pictures & Hero Banner
              </h3>
              <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Upload pictures from your computer/phone or enter direct image URLs. They will be displayed across the invitation.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {/* Hero Background Photo */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--gray-medium)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Hero Banner Background Photo</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-light)', marginBottom: '1rem' }}>
                    Main dramatic full-screen photo on top of the invitation.
                  </p>

                  <div
                    style={{
                      height: '180px',
                      background: '#222',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {settings.hero_bg_image ? (
                      <Image src={settings.hero_bg_image} alt="Hero Banner" fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-light)' }}>
                        No Image Set
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Option A: Upload New Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingField('hero_bg_image');
                          handleFileUpload(file, (url) => {
                            handleSaveSettings({ hero_bg_image: url });
                            setUploadingField(null);
                          });
                        }
                      }}
                      style={{ fontSize: '0.85rem' }}
                    />

                    <label style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>Option B: Paste Image URL</label>
                    <input
                      type="text"
                      value={settings.hero_bg_image || ''}
                      onChange={(e) => setSettings({ ...settings, hero_bg_image: e.target.value })}
                      placeholder="https://..."
                      style={{
                        padding: '0.6rem',
                        background: '#111',
                        border: '1px solid var(--gray-medium)',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    />
                    <button
                      onClick={() => handleSaveSettings({ hero_bg_image: settings.hero_bg_image || '' })}
                      className="btn-primary"
                      style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '4px' }}
                    >
                      Update Banner
                    </button>
                  </div>
                </div>

                {/* Couple Portrait Photo */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--gray-medium)' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Couple Portrait Photo</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray-light)', marginBottom: '1rem' }}>
                    Pre-nup or favorite portrait of Sandy & Bernadette.
                  </p>

                  <div
                    style={{
                      height: '180px',
                      background: '#222',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      position: 'relative',
                      marginBottom: '1rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {settings.couple_photo ? (
                      <Image src={settings.couple_photo} alt="Couple Photo" fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-light)' }}>
                        No Image Set
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Option A: Upload New Photo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingField('couple_photo');
                          handleFileUpload(file, (url) => {
                            handleSaveSettings({ couple_photo: url });
                            setUploadingField(null);
                          });
                        }
                      }}
                      style={{ fontSize: '0.85rem' }}
                    />

                    <label style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>Option B: Paste Image URL</label>
                    <input
                      type="text"
                      value={settings.couple_photo || ''}
                      onChange={(e) => setSettings({ ...settings, couple_photo: e.target.value })}
                      placeholder="https://..."
                      style={{
                        padding: '0.6rem',
                        background: '#111',
                        border: '1px solid var(--gray-medium)',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    />
                    <button
                      onClick={() => handleSaveSettings({ couple_photo: settings.couple_photo || '' })}
                      className="btn-primary"
                      style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '4px' }}
                    >
                      Update Portrait
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Wedding Titles & Dates */}
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
                Invitation Header & Names
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--gray-light)' }}>Groom Name</label>
                  <input
                    type="text"
                    value={settings.groom_name || 'Sandy'}
                    onChange={(e) => setSettings({ ...settings, groom_name: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--gray-light)' }}>Bride Name</label>
                  <input
                    type="text"
                    value={settings.bride_name || 'Bernadette'}
                    onChange={(e) => setSettings({ ...settings, bride_name: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--gray-light)' }}>Wedding Date & Time (ISO format for countdown)</label>
                  <input
                    type="text"
                    value={settings.wedding_date || '2026-12-07T15:00:00'}
                    onChange={(e) => setSettings({ ...settings, wedding_date: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--gray-light)' }}>RSVP Deadline</label>
                  <input
                    type="text"
                    value={settings.rsvp_deadline || 'November 15, 2026'}
                    onChange={(e) => setSettings({ ...settings, rsvp_deadline: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: 'var(--gray-light)' }}>Subtitle / Tagline</label>
                <input
                  type="text"
                  value={settings.wedding_subtitle || 'Two hearts. One story. A lifetime together.'}
                  onChange={(e) => setSettings({ ...settings, wedding_subtitle: e.target.value })}
                  style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                />
              </div>

              <button
                onClick={() =>
                  handleSaveSettings({
                    groom_name: settings.groom_name || 'Sandy',
                    bride_name: settings.bride_name || 'Bernadette',
                    wedding_date: settings.wedding_date || '2026-12-07T15:00:00',
                    rsvp_deadline: settings.rsvp_deadline || 'November 15, 2026',
                    wedding_subtitle: settings.wedding_subtitle || 'Two hearts. One story. A lifetime together.',
                  })
                }
                className="btn-primary"
                style={{ marginTop: '1.5rem' }}
              >
                Save Details
              </button>
            </div>

            {/* Venue & Ceremony/Reception Details */}
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
                Ceremony & Reception Venues
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Ceremony */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--gray-medium)' }}>
                  <h4 style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontWeight: 700 }}>CEREMONY</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <input
                      type="text"
                      placeholder="Venue Name (e.g. Manila Cathedral)"
                      value={settings.ceremony_venue || ''}
                      onChange={(e) => setSettings({ ...settings, ceremony_venue: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g. 3:00 PM)"
                      value={settings.ceremony_time || ''}
                      onChange={(e) => setSettings({ ...settings, ceremony_time: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                    <textarea
                      placeholder="Address"
                      value={settings.ceremony_address || ''}
                      onChange={(e) => setSettings({ ...settings, ceremony_address: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Google Maps Link"
                      value={settings.ceremony_map_link || ''}
                      onChange={(e) => setSettings({ ...settings, ceremony_map_link: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                {/* Reception */}
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--gray-medium)' }}>
                  <h4 style={{ color: 'var(--accent-red)', marginBottom: '1rem', fontWeight: 700 }}>RECEPTION</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <input
                      type="text"
                      placeholder="Venue Name (e.g. The Manila Hotel)"
                      value={settings.reception_venue || ''}
                      onChange={(e) => setSettings({ ...settings, reception_venue: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Time (e.g. 6:00 PM)"
                      value={settings.reception_time || ''}
                      onChange={(e) => setSettings({ ...settings, reception_time: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                    <textarea
                      placeholder="Address"
                      value={settings.reception_address || ''}
                      onChange={(e) => setSettings({ ...settings, reception_address: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      placeholder="Google Maps Link"
                      value={settings.reception_map_link || ''}
                      onChange={(e) => setSettings({ ...settings, reception_map_link: e.target.value })}
                      style={{ padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  handleSaveSettings({
                    ceremony_venue: settings.ceremony_venue || '',
                    ceremony_time: settings.ceremony_time || '',
                    ceremony_address: settings.ceremony_address || '',
                    ceremony_map_link: settings.ceremony_map_link || '',
                    reception_venue: settings.reception_venue || '',
                    reception_time: settings.reception_time || '',
                    reception_address: settings.reception_address || '',
                    reception_map_link: settings.reception_map_link || '',
                  })
                }
                className="btn-primary"
                style={{ marginTop: '1.5rem' }}
              >
                Save Venue Information
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: PRINCIPAL SPONSORS */}
        {/* ========================================================= */}
        {activeTab === 'sponsors' && (
          <div>
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add Principal Sponsor (Ninong / Ninang)
              </h3>

              <form onSubmit={handleAddSponsor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Atty. Roberto Tan"
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newSponsor.gender}
                    onChange={(e) => setNewSponsor({ ...newSponsor, gender: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  >
                    <option value="MALE">Ninong (Male Sponsor)</option>
                    <option value="FEMALE">Ninang (Female Sponsor)</option>
                    <option value="COUPLE">Sponsor Couple</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Partner Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mrs. Cynthia Tan"
                    value={newSponsor.partnerName}
                    onChange={(e) => setNewSponsor({ ...newSponsor, partnerName: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Photo (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => setNewSponsor({ ...newSponsor, photoUrl: url }));
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ height: '44px' }}>
                  Add Sponsor
                </button>
              </form>
            </div>

            {/* Sponsors List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
              {sponsors.map((sp) => (
                <div
                  key={sp.id}
                  style={{
                    background: 'var(--gray-dark)',
                    border: '1px solid var(--gray-medium)',
                    borderRadius: '8px',
                    padding: '1.2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#222',
                        border: '1px solid var(--accent-red)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        position: 'relative',
                        fontWeight: 700,
                      }}
                    >
                      {sp.photoUrl ? (
                        <Image src={sp.photoUrl} alt={sp.name} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        sp.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>{sp.name}</h4>
                      {sp.partnerName && <p style={{ fontSize: '0.8rem', color: 'var(--gray-light)' }}>& {sp.partnerName}</p>}
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)', textTransform: 'uppercase', fontWeight: 700 }}>
                        {sp.gender === 'MALE' ? 'Ninong' : sp.gender === 'FEMALE' ? 'Ninang' : 'Couple'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSponsor(sp.id)}
                    style={{ background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: GIFT SUGGESTIONS */}
        {/* ========================================================= */}
        {activeTab === 'gifts' && (
          <div>
            {/* Gift Message Settings */}
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.8rem' }}>
                Wishing Well Greeting / Message
              </h3>
              <textarea
                rows={4}
                value={settings.gift_message || ''}
                onChange={(e) => setSettings({ ...settings, gift_message: e.target.value })}
                style={{ width: '100%', padding: '1rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px', fontSize: '1rem', lineHeight: 1.6 }}
              />
              <button
                onClick={() => handleSaveSettings({ gift_message: settings.gift_message || '' })}
                className="btn-primary"
                style={{ marginTop: '0.8rem' }}
              >
                Save Message
              </button>
            </div>

            {/* Add Payment Method / Account */}
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add Payment Channel (GCash, Maya, Bank Transfer)
              </h3>

              <form onSubmit={handleAddGift} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Bank or Provider</label>
                  <input
                    type="text"
                    placeholder="e.g. GCash, Maya, BDO, BPI"
                    value={newGift.bankName}
                    onChange={(e) => setNewGift({ ...newGift, bankName: e.target.value, type: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Account Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sandy M. / Bernadette S."
                    value={newGift.accountName}
                    onChange={(e) => setNewGift({ ...newGift, accountName: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Account Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 0917 123 4567"
                    value={newGift.accountNumber}
                    onChange={(e) => setNewGift({ ...newGift, accountNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Upload QR Code (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => setNewGift({ ...newGift, qrCodeUrl: url }));
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ height: '44px' }}>
                  Add Channel
                </button>
              </form>
            </div>

            {/* Gifts List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {gifts.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--gray-dark)',
                    border: '1px solid var(--gray-medium)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    position: 'relative',
                  }}
                >
                  <span style={{ background: 'rgba(229,9,20,0.15)', color: 'var(--accent-red)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {item.bankName || item.type}
                  </span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '8px 0 4px' }}>{item.accountName}</h4>
                  <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', letterSpacing: '1px' }}>{item.accountNumber}</p>

                  {item.qrCodeUrl && (
                    <div style={{ marginTop: '1rem', width: '100%', height: '120px', position: 'relative', background: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
                      <Image src={item.qrCodeUrl} alt="QR" fill style={{ objectFit: 'contain', padding: '6px' }} />
                    </div>
                  )}

                  <button
                    onClick={() => handleDeleteGift(item.id)}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: FAQS */}
        {/* ========================================================= */}
        {activeTab === 'faqs' && (
          <div>
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add Frequently Asked Question
              </h3>

              <form onSubmit={handleAddFaq} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Question</label>
                  <input
                    type="text"
                    placeholder="e.g. Can I bring a plus one?"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Answer</label>
                  <textarea
                    rows={3}
                    placeholder="Provide a clear, polite explanation..."
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                  Add FAQ
                </button>
              </form>
            </div>

            {/* FAQ List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((f, i) => (
                <div
                  key={f.id}
                  style={{
                    background: 'var(--gray-dark)',
                    border: '1px solid var(--gray-medium)',
                    borderRadius: '8px',
                    padding: '1.2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                      {i + 1}. {f.question}
                    </h4>
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                      {f.answer}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(f.id)}
                    style={{ background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: STORY EPISODES */}
        {/* ========================================================= */}
        {activeTab === 'episodes' && (
          <div>
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add Story Episode
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newEpisode.title.trim()) return;
                  await fetch('/api/admin/episodes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newEpisode, order: episodes.length + 1 }),
                  });
                  setNewEpisode({ title: '', date: '', description: '', photoUrl: '' });
                  fetchEpisodes();
                  showToast('Episode added!');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Episode Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The First Date"
                    value={newEpisode.title}
                    onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Date / Month</label>
                  <input
                    type="text"
                    placeholder="e.g. July 2020"
                    value={newEpisode.date}
                    onChange={(e) => setNewEpisode({ ...newEpisode, date: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Photo (Upload or URL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => setNewEpisode({ ...newEpisode, photoUrl: url }));
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Description</label>
                  <textarea
                    rows={2}
                    placeholder="Tell the memory..."
                    value={newEpisode.description}
                    onChange={(e) => setNewEpisode({ ...newEpisode, description: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ height: '44px' }}>
                  Add Episode
                </button>
              </form>
            </div>

            {/* Episodes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  style={{
                    background: 'var(--gray-dark)',
                    border: '1px solid var(--gray-medium)',
                    borderRadius: '8px',
                    padding: '1.2rem',
                    display: 'flex',
                    gap: '1.2rem',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ width: '100px', height: '70px', position: 'relative', background: '#222', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                    {ep.photoUrl && <Image src={ep.photoUrl} alt={ep.title} fill style={{ objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{ep.title} <span style={{ color: 'var(--accent-red)', fontSize: '0.85rem' }}>{ep.date}</span></h4>
                    <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', margin: 0 }}>{ep.description}</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete episode?')) return;
                      await fetch(`/api/admin/episodes?id=${ep.id}`, { method: 'DELETE' });
                      fetchEpisodes();
                    }}
                    style={{ background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: ENTOURAGE */}
        {/* ========================================================= */}
        {activeTab === 'entourage' && (
          <div>
            <div style={{ background: 'var(--gray-dark)', border: '1px solid var(--gray-medium)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                Add Cast / Entourage Member
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newEntourage.name.trim() || !newEntourage.role.trim()) return;
                  await fetch('/api/admin/entourage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...newEntourage, order: entourage.length + 1 }),
                  });
                  setNewEntourage({ name: '', role: '', photoUrl: '' });
                  fetchEntourage();
                  showToast('Entourage member added!');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Camille Reyes"
                    value={newEntourage.name}
                    onChange={(e) => setNewEntourage({ ...newEntourage, name: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Maid of Honor, Best Man, Bridesmaid"
                    value={newEntourage.role}
                    onChange={(e) => setNewEntourage({ ...newEntourage, role: e.target.value })}
                    style={{ width: '100%', padding: '0.8rem', background: '#111', border: '1px solid var(--gray-medium)', color: '#fff', borderRadius: '6px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '4px' }}>Photo (Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => setNewEntourage({ ...newEntourage, photoUrl: url }));
                      }
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{ height: '44px' }}>
                  Add Member
                </button>
              </form>
            </div>

            {/* Entourage List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {entourage.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'var(--gray-dark)',
                    border: '1px solid var(--gray-medium)',
                    borderRadius: '8px',
                    padding: '1.2rem',
                    textAlign: 'center',
                    position: 'relative',
                  }}
                >
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 10px', background: '#222', position: 'relative', overflow: 'hidden' }}>
                    {m.photoUrl ? (
                      <Image src={m.photoUrl} alt={m.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-light)' }}>
                        {m.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{m.name}</h4>
                  <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>{m.role}</p>
                  <button
                    onClick={async () => {
                      if (!confirm('Remove member?')) return;
                      await fetch(`/api/admin/entourage?id=${m.id}`, { method: 'DELETE' });
                      fetchEntourage();
                    }}
                    style={{ background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', fontSize: '0.8rem', marginTop: '6px' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
