"use client";

import React from 'react';

interface WeddingDetailsProps {
  ceremonyTime?: string;
  ceremonyVenue?: string;
  ceremonyAddress?: string;
  ceremonyMapLink?: string;
  receptionTime?: string;
  receptionVenue?: string;
  receptionAddress?: string;
  receptionMapLink?: string;
  dressCodeTitle?: string;
  dressCodeDesc?: string;
}

export default function WeddingDetails({
  ceremonyTime = "3:00 PM",
  ceremonyVenue = "Manila Cathedral",
  ceremonyAddress = "Cabildo cor. Beaterio St., Intramuros, Manila, Philippines",
  ceremonyMapLink = "https://maps.google.com/?q=Manila+Cathedral",
  receptionTime = "6:00 PM",
  receptionVenue = "The Manila Hotel",
  receptionAddress = "1 Rizal Park, Ermita, Manila, Philippines",
  receptionMapLink = "https://maps.google.com/?q=The+Manila+Hotel",
  dressCodeTitle = "Formal Attire",
  dressCodeDesc = "Gentlemen: Suit and tie or Barong Tagalog.\nLadies: Long evening gown in dark cinematic colors (Black, Deep Red, Emerald).",
}: WeddingDetailsProps) {
  return (
    <section id="details" className="section-padding container">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
          Time & Location
        </span>
        <h2 className="section-title">The Wedding Details</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
        {/* Ceremony */}
        <div
          className="fade-in"
          style={{
            backgroundColor: 'var(--gray-dark)',
            padding: '3rem 2.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid var(--gray-medium)',
            borderTop: '4px solid var(--accent-red)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ marginBottom: '1rem', color: 'var(--accent-red)', display: 'flex', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v6m-3-3h6"></path>
                <path d="M18 22V9l-6-4-6 4v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1z"></path>
                <path d="M10 22v-6a2 2 0 0 1 4 0v6"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff' }}>
              The Ceremony
            </h3>
            <p style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.8rem' }}>
              {ceremonyTime}
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              {ceremonyVenue}
            </p>
            <p style={{ color: 'var(--gray-light)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {ceremonyAddress}
            </p>
          </div>
          <a
            href={ceremonyMapLink}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            GET CEREMONY DIRECTIONS
          </a>
        </div>

        {/* Reception */}
        <div
          className="fade-in"
          style={{
            backgroundColor: 'var(--gray-dark)',
            padding: '3rem 2.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid var(--gray-medium)',
            borderTop: '4px solid var(--accent-red)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ marginBottom: '1rem', color: 'var(--accent-red)', display: 'flex', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 22h8"></path>
                <path d="M12 15v7"></path>
                <path d="M12 15a5 5 0 0 0 5-5c0-4-3-8-5-8s-5 4-5 8a5 5 0 0 0 5 5z"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff' }}>
              The Reception
            </h3>
            <p style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.8rem' }}>
              {receptionTime}
            </p>
            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              {receptionVenue}
            </p>
            <p style={{ color: 'var(--gray-light)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {receptionAddress}
            </p>
          </div>
          <a
            href={receptionMapLink}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ width: '100%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            GET RECEPTION DIRECTIONS
          </a>
        </div>

        {/* Dress Code */}
        <div
          className="fade-in"
          style={{
            backgroundColor: 'var(--gray-dark)',
            padding: '3rem 2.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid var(--gray-medium)',
            borderTop: '4px solid var(--accent-red)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ marginBottom: '1rem', color: 'var(--accent-red)', display: 'flex', justifyContent: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#fff' }}>
              {dressCodeTitle}
            </h3>
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '1rem' }}>
              Cinematic Formal
            </p>
            <p style={{ color: 'var(--gray-light)', marginBottom: '1.5rem', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {dressCodeDesc}
            </p>
          </div>
          <div
            style={{
              padding: '0.8rem',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              Please avoid wearing white or ivory out of respect for the bride.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
