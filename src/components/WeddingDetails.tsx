"use client";

import React, { useState } from 'react';
import Image from 'next/image';

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
  dressCodePhoto?: string;
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
  dressCodePhoto,
}: WeddingDetailsProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  return (
    <section id="details" className="section-padding container">
      {/* Zoom Modal for Dress Code Moodboard */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '88vh',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
              border: '1px solid rgba(255,255,255,0.2)',
              background: '#111',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
              <Image
                src={zoomedImage}
                alt="Dress Code Palette & Moodboard"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <button
              onClick={() => setZoomedImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        {/* Ceremony */}
        <div
          className="fade-in"
          style={{
            backgroundColor: 'var(--gray-dark)',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2.2rem)',
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
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2.2rem)',
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

        {/* Dress Code with Moodboard / Style Photo */}
        <div
          className="fade-in"
          style={{
            backgroundColor: 'var(--gray-dark)',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.2rem, 3vw, 2.2rem)',
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
            <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.8rem' }}>
              Cinematic Formal
            </p>
            <p style={{ color: 'var(--gray-light)', marginBottom: '1.2rem', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
              {dressCodeDesc}
            </p>

            {/* Visual Color Palette / Moodboard Guide */}
            {dressCodePhoto && (
              <div style={{ marginBottom: '1.2rem' }}>
                <div
                  onClick={() => setZoomedImage(dressCodePhoto)}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '190px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.18)',
                    cursor: 'zoom-in',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                  }}
                  title="Click to zoom attire & color palette guide"
                >
                  <Image
                    src={dressCodePhoto}
                    alt="Attire Style & Color Guide"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                      padding: '8px',
                      fontSize: '0.78rem',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    <span>Click to view color palette & style</span>
                  </div>
                </div>
              </div>
            )}
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
