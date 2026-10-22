"use client";

import React from 'react';
import Image from 'next/image';

export interface Sponsor {
  id: string;
  name: string;
  gender: string; // "MALE", "FEMALE", "COUPLE"
  partnerName?: string | null;
  role: string;
  photoUrl?: string | null;
  order?: number;
}

interface PrincipalSponsorsProps {
  sponsors?: Sponsor[];
}

const DEFAULT_SPONSORS: Sponsor[] = [
  { id: '1', name: 'Hon. Roberto Tan', gender: 'MALE', role: 'Principal Sponsor', order: 1 },
  { id: '2', name: 'Dr. Evelyn Tan', gender: 'FEMALE', role: 'Principal Sponsor', order: 2 },
  { id: '3', name: 'Mr. Antonio Morales', gender: 'MALE', role: 'Principal Sponsor', order: 3 },
  { id: '4', name: 'Mrs. Cynthia Morales', gender: 'FEMALE', role: 'Principal Sponsor', order: 4 },
  { id: '5', name: 'Atty. Fernando Reyes', gender: 'MALE', role: 'Principal Sponsor', order: 5 },
  { id: '6', name: 'Mrs. Maria Elena Reyes', gender: 'FEMALE', role: 'Principal Sponsor', order: 6 },
  { id: '7', name: 'Engr. Danilo Ramos', gender: 'MALE', role: 'Principal Sponsor', order: 7 },
  { id: '8', name: 'Mrs. Corazon Ramos', gender: 'FEMALE', role: 'Principal Sponsor', order: 8 },
];

export default function PrincipalSponsors({ sponsors = [] }: PrincipalSponsorsProps) {
  const displaySponsors = sponsors.length > 0 ? sponsors : DEFAULT_SPONSORS;
  const maleSponsors = displaySponsors.filter((s) => s.gender === 'MALE');
  const femaleSponsors = displaySponsors.filter((s) => s.gender === 'FEMALE');
  const couplesOrOthers = displaySponsors.filter((s) => s.gender !== 'MALE' && s.gender !== 'FEMALE');

  const hasGrouped = maleSponsors.length > 0 || femaleSponsors.length > 0;

  return (
    <section id="sponsors" className="section-padding container">
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
          Special Guests of Honor
        </span>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          Principal Sponsors
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--gray-light)',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}
        >
          Our beloved Ninongs and Ninangs, who stand beside us with their wisdom, guidance, and prayers as we begin our marriage.
        </p>
      </div>

      {hasGrouped ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(1.5rem, 3vw, 2.5rem)',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {/* Male Sponsors (Ninongs) */}
          <div
            className="fade-in"
            style={{
              background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(18,18,18,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '3px solid var(--accent-red)',
              borderRadius: '12px',
              padding: 'clamp(1.6rem, 3.5vw, 2.5rem) clamp(1rem, 2.5vw, 2rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(229, 9, 20, 0.15)',
                  color: 'var(--accent-red)',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Groom & Bride's Godfathers
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
                Ninongs
              </h3>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {maleSponsors.map((sponsor) => (
                <li
                  key={sponsor.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.8rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
                      border: '1.5px solid var(--accent-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#fff',
                      fontSize: '0.95rem',
                      flexShrink: 0,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {sponsor.photoUrl ? (
                      <Image src={sponsor.photoUrl} alt={sponsor.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      sponsor.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                      {sponsor.name}
                    </h4>
                    {sponsor.partnerName && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', margin: 0 }}>
                        & {sponsor.partnerName}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Female Sponsors (Ninangs) */}
          <div
            className="fade-in"
            style={{
              background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, rgba(18,18,18,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '3px solid var(--accent-red)',
              borderRadius: '12px',
              padding: 'clamp(1.6rem, 3.5vw, 2.5rem) clamp(1rem, 2.5vw, 2rem)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(229, 9, 20, 0.15)',
                  color: 'var(--accent-red)',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '0.5rem',
                }}
              >
                Groom & Bride's Godmothers
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
                Ninangs
              </h3>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {femaleSponsors.map((sponsor) => (
                <li
                  key={sponsor.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.8rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
                      border: '1.5px solid var(--accent-red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#fff',
                      fontSize: '0.95rem',
                      flexShrink: 0,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {sponsor.photoUrl ? (
                      <Image src={sponsor.photoUrl} alt={sponsor.name} fill style={{ objectFit: 'cover' }} />
                    ) : (
                      sponsor.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
                      {sponsor.name}
                    </h4>
                    {sponsor.partnerName && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', margin: 0 }}>
                        & {sponsor.partnerName}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        /* Fallback if single list */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              style={{
                background: 'var(--gray-dark)',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid var(--gray-medium)',
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
                {sponsor.name}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-red)', textTransform: 'uppercase' }}>
                {sponsor.role}
              </p>
            </div>
          ))}
        </div>
      )}

      {couplesOrOthers.length > 0 && (
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            {couplesOrOthers.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                {s.name} {s.partnerName ? `& ${s.partnerName}` : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
