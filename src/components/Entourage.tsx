"use client";

import React from 'react';
import Image from 'next/image';

export interface CastMember {
  id: string;
  name: string;
  role: string;
  category?: string;
  photoUrl?: string | null;
  description?: string | null;
}

export default function Entourage({ members = [] }: { members?: CastMember[] }) {
  const displayMembers = members.length > 0 ? members : [
    { id: '1', name: 'Maria Santos', role: 'Maid of Honor', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { id: '2', name: 'Juan Cruz', role: 'Best Man', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
    { id: '3', name: 'Camille Reyes', role: 'Bridesmaid', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80' },
    { id: '4', name: 'Mark Bautista', role: 'Groomsman', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
    { id: '5', name: 'Patricia Gomez', role: 'Bridesmaid', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
    { id: '6', name: 'David Lee', role: 'Groomsman', photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80' },
  ];

  return (
    <section id="cast" className="section-padding container">
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
          Starring Characters
        </span>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          THE CAST & ENTOURAGE
        </h2>
        <p style={{ fontSize: '1.15rem', color: 'var(--gray-light)', fontStyle: 'italic', maxWidth: '600px', margin: '0 auto' }}>
          The treasured friends and family members playing starring roles in our love story.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
          gap: 'clamp(1rem, 2.5vw, 2rem)',
        }}
      >
        {displayMembers.map((member) => (
          <div
            key={member.id}
            className="fade-in"
            style={{
              textAlign: 'center',
              background: 'var(--gray-dark)',
              borderRadius: '10px',
              padding: '1.2rem',
              border: '1px solid var(--gray-medium)',
              transition: 'transform 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'var(--accent-red)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'var(--gray-medium)';
            }}
          >
            <div
              style={{
                width: '100%',
                paddingTop: '125%', // 4:5 aspect ratio
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '1rem',
                backgroundColor: '#222',
              }}
            >
              {member.photoUrl ? (
                <Image
                  src={member.photoUrl}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 250px"
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
                    background: 'linear-gradient(135deg, #2b2b2b, #151515)',
                    color: 'var(--gray-light)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                  }}
                >
                  {member.name.charAt(0)}
                </div>
              )}
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.3rem', color: '#fff' }}>
              {member.name}
            </h4>
            <p
              style={{
                color: 'var(--accent-red)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {member.role}
            </p>
            {member.description && (
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-light)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                {member.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
