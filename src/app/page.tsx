import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';

import Countdown from '@/components/Countdown';
import StoryEpisodes from '@/components/StoryEpisodes';
import WeddingDetails from '@/components/WeddingDetails';
import PrincipalSponsors from '@/components/PrincipalSponsors';
import Entourage from '@/components/Entourage';
import GiftSuggestion from '@/components/GiftSuggestion';
import FaqSection from '@/components/FaqSection';
import RsvpSystem from '@/components/RsvpSystem';

export const dynamic = 'force-dynamic';

async function getInvitationData() {
  try {
    const [settingsList, episodes, entourage, sponsors, faqs, gifts] = await Promise.all([
      prisma.setting.findMany(),
      prisma.episode.findMany({ orderBy: { order: 'asc' } }),
      prisma.entourage.findMany({ orderBy: { order: 'asc' } }),
      prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }),
      prisma.faq.findMany({ orderBy: { order: 'asc' } }),
      prisma.giftOption.findMany({ orderBy: { order: 'asc' } }),
    ]);

    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    return { settings, episodes, entourage, sponsors, faqs, gifts };
  } catch (err) {
    console.error('Error loading invitation data:', err);
    return {
      settings: {},
      episodes: [],
      entourage: [],
      sponsors: [],
      faqs: [],
      gifts: [],
    };
  }
}

export default async function Home() {
  const { settings, episodes, entourage, sponsors, faqs, gifts } = await getInvitationData();

  const brideName = settings.bride_name || 'Bernadette';
  const groomName = settings.groom_name || 'Sandy';
  const weddingDate = settings.wedding_date || '2026-12-07T15:00:00';
  const heroBg = settings.hero_bg_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80';
  const subtitle = settings.wedding_subtitle || 'Two hearts. One story. A lifetime together.';

  return (
    <main>
      {/* Navigation */}
      <nav
        className="nav-glass"
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 50,
          padding: '0.8rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          background: 'rgba(20, 20, 20, 0.85)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Link href="#home" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid rgba(255,255,255,0.4)',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image src="/logo.png" alt="S & B Monogram Logo" fill style={{ objectFit: 'contain', padding: '2px' }} />
          </div>
          <span style={{ color: 'var(--accent-red)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
            S & B
          </span>
        </Link>

        <ul
          style={{
            display: 'flex',
            gap: '1.6rem',
            listStyle: 'none',
            fontWeight: 500,
            fontSize: '0.85rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <li><Link href="#home" style={{ transition: 'color 0.2s' }}>Home</Link></li>
          <li><Link href="#story" style={{ transition: 'color 0.2s' }}>Our Story</Link></li>
          <li><Link href="#details" style={{ transition: 'color 0.2s' }}>Details</Link></li>
          <li><Link href="#sponsors" style={{ transition: 'color 0.2s' }}>Sponsors</Link></li>
          <li><Link href="#cast" style={{ transition: 'color 0.2s' }}>The Cast</Link></li>
          <li><Link href="#gift-guide" style={{ transition: 'color 0.2s' }}>Gift Guide</Link></li>
          <li><Link href="#faqs" style={{ transition: 'color 0.2s' }}>FAQs</Link></li>
          <li>
            <Link
              href="#rsvp"
              style={{
                background: 'var(--accent-red)',
                color: '#fff',
                padding: '0.4rem 1rem',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '1px',
              }}
            >
              RSVP
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              title="Bride & Groom Portal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.85)',
                padding: '0.35rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Couple Portal
            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '6rem 2rem 4rem 4rem',
          overflow: 'hidden',
        }}
      >
        {/* Background Image with Dark Vignette Gradient */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {heroBg && (
            <Image
              src={heroBg}
              alt="Sandy & Bernadette"
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(14,14,14,0.95) 0%, rgba(14,14,14,0.7) 45%, rgba(14,14,14,0.4) 100%), linear-gradient(to top, rgba(14,14,14,1) 0%, rgba(14,14,14,0) 40%)',
            }}
          />
        </div>

        <div className="fade-in" style={{ position: 'relative', zIndex: 10, maxWidth: '680px', paddingTop: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(229, 9, 20, 0.25)',
              border: '1px solid var(--accent-red)',
              padding: '4px 14px',
              borderRadius: '20px',
              marginBottom: '1.2rem',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>
              NETFLIX ORIGINAL LOVE STORY
            </span>
          </div>

          <h2 style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            A Love Story
          </h2>

          <h1
            className="text-gradient"
            style={{
              fontSize: 'clamp(3rem, 7vw, 5.2rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '1.2rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {groomName} <br />& {brideName}
          </h1>

          <p style={{ fontSize: '1.25rem', color: 'var(--gray-light)', marginBottom: '2.2rem', fontStyle: 'italic', lineHeight: 1.5 }}>
            "{subtitle}"
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <Link href="#rsvp" className="btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              WATCH INVITATION & RSVP
            </Link>
            <Link href="#details" className="btn-secondary" style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              VIEW DETAILS
            </Link>
          </div>

          <div style={{ borderLeft: '3px solid var(--accent-red)', paddingLeft: '1.2rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.3rem' }}>
              PREMIERING ON
            </p>
            <p style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
              December 7, 2026
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-light)' }}>
              Manila Cathedral • The Manila Hotel
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid var(--gray-medium)' }}>
        <Countdown targetDate={weddingDate} />
      </section>

      {/* Our Story Episodes */}
      <StoryEpisodes episodes={episodes} />

      {/* The Details */}
      <WeddingDetails
        ceremonyTime={settings.ceremony_time}
        ceremonyVenue={settings.ceremony_venue}
        ceremonyAddress={settings.ceremony_address}
        ceremonyMapLink={settings.ceremony_map_link}
        receptionTime={settings.reception_time}
        receptionVenue={settings.reception_venue}
        receptionAddress={settings.reception_address}
        receptionMapLink={settings.reception_map_link}
        dressCodeTitle={settings.dress_code_title}
        dressCodeDesc={settings.dress_code_desc}
      />

      {/* Principal Sponsors Section (NEW) */}
      <PrincipalSponsors sponsors={sponsors} />

      {/* The Cast & Entourage */}
      <Entourage members={entourage} />

      {/* Gift Suggestion Section (NEW) */}
      <GiftSuggestion giftMessage={settings.gift_message} options={gifts} />

      {/* FAQ Section (NEW) */}
      <FaqSection faqs={faqs} />

      {/* RSVP System */}
      <RsvpSystem rsvpDeadline={settings.rsvp_deadline} />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--gray-medium)',
          backgroundColor: '#0a0a0a',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ color: 'var(--accent-red)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '0.5rem' }}>
            {groomName} & {brideName}
          </h3>
          <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '2rem' }}>
            "Two hearts, one lifelong adventure. Thank you for being a chapter in our love story."
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--gray-light)', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link href="#home">Home</Link>
            <Link href="#story">Our Story</Link>
            <Link href="#details">Details</Link>
            <Link href="#sponsors">Principal Sponsors</Link>
            <Link href="#cast">The Cast</Link>
            <Link href="#gift-guide">Gift Guide</Link>
            <Link href="#faqs">FAQs</Link>
            <Link href="#rsvp">RSVP</Link>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: 0 }}>
              2026 Sandy & Bernadette Wedding Invitation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
