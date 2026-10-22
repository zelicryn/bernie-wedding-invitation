"use client";

import React from 'react';
import Image from 'next/image';

export interface Episode {
  id: string;
  title: string;
  date?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  videoUrl?: string | null;
  order?: number;
}

export default function StoryEpisodes({ episodes = [] }: { episodes?: Episode[] }) {
  const displayEpisodes = episodes.length > 0 ? episodes : [
    {
      id: '1',
      title: 'The Pilot Episode: The First Hello',
      date: 'June 2020',
      description: 'It started with a simple hello and turned into a lifetime together.',
      photoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section id="story" className="section-padding container">
      <div style={{ marginBottom: '3rem' }}>
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
          Episodes of Us
        </span>
        <h2 className="section-title">
          <span style={{ color: 'var(--accent-red)', marginRight: '10px' }}>||</span>
          Our Story
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {displayEpisodes.map((ep, index) => (
          <div
            key={ep.id}
            className="fade-in"
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              background: 'var(--gray-dark)',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--gray-medium)',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.01)';
              e.currentTarget.style.borderColor = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'var(--gray-medium)';
            }}
          >
            <div
              style={{
                flex: '1 1 320px',
                minHeight: '220px',
                backgroundColor: '#222',
                position: 'relative',
              }}
            >
              {ep.photoUrl ? (
                <Image
                  src={ep.photoUrl}
                  alt={ep.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle, #333 0%, #1a1a1a 100%)',
                    color: 'var(--gray-light)',
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                  </svg>
                </div>
              )}
              {ep.date && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {ep.date}
                </div>
              )}
            </div>

            <div
              style={{
                flex: '2 1 350px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem' }}>
                <span
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--accent-red)',
                    fontFamily: 'monospace',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{ep.title}</h3>
              </div>
              <p style={{ color: 'var(--gray-light)', lineHeight: 1.7, fontSize: '1rem' }}>
                {ep.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
