import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import Countdown from '@/components/Countdown';
import StoryEpisodes from '@/components/StoryEpisodes';
import WeddingDetails from '@/components/WeddingDetails';
import PrincipalSponsors from '@/components/PrincipalSponsors';
import Entourage from '@/components/Entourage';
import GiftSuggestion from '@/components/GiftSuggestion';
import FaqSection from '@/components/FaqSection';
import RsvpSystem from '@/components/RsvpSystem';

import { getPersistentSettings } from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

async function getInvitationData() {
  try {
    const [settingsList, episodes, entourage, sponsors, faqs, gifts, blobSettings] = await Promise.all([
      prisma.setting.findMany().catch(() => []),
      prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      getPersistentSettings().catch(() => ({})),
    ]);

    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    const mergedSettings = { ...settings, ...blobSettings };

    return { settings: mergedSettings, episodes, entourage, sponsors, faqs, gifts };
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
      {/* Responsive Navigation */}
      <Navigation />

      {/* Hero Section (Netflix Mobile App Style) */}
      <HeroSection
        brideName={brideName}
        groomName={groomName}
        weddingDate={weddingDate}
        heroBg={heroBg}
        subtitle={subtitle}
        ceremonyVenue={settings.ceremony_venue}
        receptionVenue={settings.reception_venue}
      />

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
            &ldquo;Two hearts, one lifelong adventure. Thank you for being a chapter in our love story.&rdquo;
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
