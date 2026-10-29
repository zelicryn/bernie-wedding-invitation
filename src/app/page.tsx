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

import {
  getPersistentSettings,
  getPersistentSponsors,
  getPersistentEntourage,
  getPersistentGifts,
  getPersistentEpisodes,
  getPersistentFaqs,
} from '@/lib/blobStorage';

export const dynamic = 'force-dynamic';

async function getInvitationData() {
  try {
    const [
      settingsList,
      dbEpisodes,
      dbEntourage,
      dbSponsors,
      dbFaqs,
      dbGifts,
      blobSettings,
      blobSponsors,
      blobEntourage,
      blobGifts,
      blobEpisodes,
      blobFaqs,
    ] = await Promise.all([
      prisma.setting.findMany().catch(() => []),
      prisma.episode.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.entourage.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.principalSponsor.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.faq.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      prisma.giftOption.findMany({ orderBy: { order: 'asc' } }).catch(() => []),
      getPersistentSettings().catch(() => ({})),
      getPersistentSponsors().catch(() => null),
      getPersistentEntourage().catch(() => null),
      getPersistentGifts().catch(() => null),
      getPersistentEpisodes().catch(() => null),
      getPersistentFaqs().catch(() => null),
    ]);

    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    const mergedSettings = { ...settings, ...blobSettings };

    return {
      settings: mergedSettings,
      episodes: blobEpisodes !== null ? blobEpisodes : dbEpisodes,
      entourage: blobEntourage !== null ? blobEntourage : dbEntourage,
      sponsors: blobSponsors !== null ? blobSponsors : dbSponsors,
      faqs: blobFaqs !== null ? blobFaqs : dbFaqs,
      gifts: blobGifts !== null ? blobGifts : dbGifts,
    };
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
        ceremonyPhoto={settings.ceremony_photo}
        receptionTime={settings.reception_time}
        receptionVenue={settings.reception_venue}
        receptionAddress={settings.reception_address}
        receptionMapLink={settings.reception_map_link}
        receptionPhoto={settings.reception_photo}
        dressCodeTitle={settings.dress_code_title}
        dressCodeSubtitle={settings.dress_code_subtitle}
        dressCodeDesc={settings.dress_code_desc}
        dressCodePhoto={settings.dress_code_photo}
      />

      {/* Principal Sponsors Section (NEW) */}
      <PrincipalSponsors sponsors={sponsors} />

      {/* The Cast */}
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <Link href="#story" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>Episodes</Link>
            <Link href="#details" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>Details</Link>
            <Link href="#sponsors" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>Sponsors</Link>
            <Link href="#cast" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>The Cast</Link>
            <Link href="#gift-guide" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>Gift Guide</Link>
            <Link href="#faq" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>FAQ</Link>
            <Link href="#rsvp" style={{ color: 'var(--gray-light)', fontSize: '0.9rem' }}>RSVP</Link>
          </div>
          <p style={{ color: '#666', fontSize: '0.8rem' }}>
            &copy; {new Date().getFullYear()} {groomName} & {brideName}. All rights reserved. Netflix-inspired Wedding Portal.
          </p>
        </div>
      </footer>
    </main>
  );
}
