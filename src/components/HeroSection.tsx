"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Cast, Download, Bell, Play, Plus, Check, Search, Film, Home as HomeIcon, User, X } from 'lucide-react';

interface HeroSectionProps {
  brideName: string;
  groomName: string;
  weddingDate: string;
  heroBg: string;
  subtitle: string;
  ceremonyVenue?: string;
  receptionVenue?: string;
}

export default function HeroSection({
  brideName,
  groomName,
  weddingDate,
  heroBg,
  subtitle,
  ceremonyVenue = 'Manila Cathedral',
  receptionVenue = 'The Manila Hotel',
}: HeroSectionProps) {
  const [inMyList, setInMyList] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCastModal, setShowCastModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Series');
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'story' | 'details' | 'rsvp'>('home');

  // Track active section on scroll to update bottom floating navigation
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const rsvpEl = document.getElementById('rsvp');
      const detailsEl = document.getElementById('details');
      const storyEl = document.getElementById('story');

      if (rsvpEl && scrollPos >= rsvpEl.offsetTop) {
        setActiveNavTab('rsvp');
      } else if (detailsEl && scrollPos >= detailsEl.offsetTop) {
        setActiveNavTab('details');
      } else if (storyEl && scrollPos >= storyEl.offsetTop) {
        setActiveNavTab('story');
      } else {
        setActiveNavTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const handleToggleMyList = () => {
    const newState = !inMyList;
    setInMyList(newState);
    if (newState) {
      showToast(`✓ Added to My List! Wedding premiere reminder set for Dec 7, 2026.`);
    } else {
      showToast(`Removed from My List.`);
    }
  };

  const handleDownloadCalendar = () => {
    const formattedStartDate = weddingDate ? weddingDate.replace(/[-:]/g, '').split('.')[0] : '20261207T150000';
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sandy and Bernadette//Wedding Invitation//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:${groomName} & ${brideName} - Wedding Premiere`,
      `DESCRIPTION:You are warmly invited to celebrate the wedding of ${groomName} & ${brideName}! Ceremony at ${ceremonyVenue}, Reception at ${receptionVenue}.`,
      `LOCATION:${ceremonyVenue}`,
      `DTSTART:${formattedStartDate}`,
      'DTEND:20261207T220000',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${groomName}-${brideName}-Wedding.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    showToast(`📅 Wedding event saved! Added to your calendar.`);
  };

  const handleBellNotification = () => {
    showToast(`🔔 Notifications enabled! We'll notify you on wedding day.`);
  };

  const categories = [
    { label: 'Series', href: '#home' },
    { label: 'Films', href: '#story' },
    { label: 'Our Story', href: '#story' },
    { label: 'The Details', href: '#details' },
    { label: 'The Cast', href: '#cast' },
    { label: 'RSVP', href: '#rsvp' },
    { label: 'Categories ▾', href: '#details' },
  ];

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        paddingTop: 'clamp(4.2rem, 9vh, 5.5rem)',
        paddingBottom: '2.5rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Ambient Glow (matches photo tone) */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '800px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(229, 9, 20, 0.15) 0%, rgba(212, 175, 55, 0.08) 40%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '520px',
          margin: '0 auto',
          padding: '0 0.75rem',
        }}
      >
        {/* Top App Header (Netflix 'N' + Home + Cast / Download / Bell) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 0.6rem 0.8rem 0.6rem',
          }}
        >
          {/* Left: Netflix Red N & "Home" Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Netflix Stylized Red Ribbon Logo */}
            <div
              style={{
                width: '26px',
                height: '36px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              title="Netflix Wedding Premiere"
            >
              <svg width="24" height="34" viewBox="0 0 111 200" fill="none">
                {/* Left vertical bar */}
                <path d="M0 0H33.5V200H0V0Z" fill="#B81D24" />
                {/* Right vertical bar */}
                <path d="M77.5 0H111V200H77.5V0Z" fill="#B81D24" />
                {/* Diagonal ribbon bar with red drop-shadow */}
                <path
                  d="M0 0L77.5 200H111L33.5 0H0Z"
                  fill="#E50914"
                  filter="drop-shadow(0px 0px 4px rgba(0,0,0,0.7))"
                />
              </svg>
            </div>

            <span
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.4px',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Home
            </span>
          </div>

          {/* Right: Screen Cast, Download Calendar, Bell Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Cast Screen */}
            <button
              onClick={() => setShowCastModal(true)}
              aria-label="Cast to TV"
              title="Cast to TV / Screen"
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Cast size={22} strokeWidth={2} />
            </button>

            {/* Download Calendar (.ics) */}
            <button
              onClick={handleDownloadCalendar}
              aria-label="Download to Calendar"
              title="Add wedding to your Calendar (.ics)"
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Download size={22} strokeWidth={2} />
            </button>

            {/* Notification Bell */}
            <button
              onClick={handleBellNotification}
              aria-label="Set Reminder"
              title="Get Wedding Notification"
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Bell size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Horizontal Category Pills Bar */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            padding: '0.3rem 0.4rem 1rem 0.4rem',
            whiteSpace: 'nowrap',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.label;
            const isDropdown = cat.label === 'Categories ▾';

            if (isDropdown) {
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setShowCategoriesModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.42rem 1.05rem',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    letterSpacing: '0.2px',
                    background: 'rgba(42, 42, 42, 0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(42, 42, 42, 0.75)')}
                >
                  {cat.label}
                </button>
              );
            }

            return (
              <Link
                key={cat.label}
                href={cat.href}
                onClick={() => setActiveCategory(cat.label)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.42rem 1.05rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  letterSpacing: '0.2px',
                  textDecoration: 'none',
                  background: isActive
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'rgba(42, 42, 42, 0.75)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  border: isActive
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.16)',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Featured Hero Poster Card (exact replica of the screenshot) */}
        <div
          className="fade-in"
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5.2',
            minHeight: '490px',
            borderRadius: '22px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: '0 20px 48px rgba(0, 0, 0, 0.85), 0 0 1px rgba(255, 255, 255, 0.2)',
            backgroundColor: '#161616',
          }}
        >
          {/* Background Couple Image */}
          {heroBg && (
            <Image
              src={heroBg}
              alt={`${groomName} & ${brideName}`}
              fill
              priority
              sizes="(max-width: 600px) 100vw, 520px"
              style={{
                objectFit: 'cover',
                objectPosition: 'center 20%',
              }}
            />
          )}

          {/* Top Subtle Vignette Gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '24%',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Dramatic Dark Gradient for Typography & Buttons */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '62%',
              background:
                'linear-gradient(to top, rgba(14,14,14,0.98) 0%, rgba(14,14,14,0.85) 28%, rgba(14,14,14,0.45) 58%, rgba(14,14,14,0.12) 80%, transparent 100%)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />

          {/* Bottom Card Content: Title, Subtitle, Buttons */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1.4rem 1.1rem 1.3rem 1.1rem',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* The Cinematic Gold Serif Title ("WHERE FOREVER BEGINS" / "SANDY & BERNADETTE") */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                marginBottom: '0.2rem',
              }}
            >
              {/* Large Gold Drop-Cap Initial "W" */}
              <span className="hero-gold-dropcap">W</span>

              {/* Two stacked lines in gold serif: "HERE FOREVER" & "BEGINS" */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  lineHeight: 1.05,
                }}
              >
                <span className="hero-gold-title-line">HERE FOREVER</span>
                <span className="hero-gold-title-line">BEGINS</span>
              </div>
            </div>

            {/* Couple Names Line */}
            <h1 className="hero-couple-names" style={{ margin: '0 0 0.5rem 0' }}>
              {groomName} & {brideName}
            </h1>

            {/* Subtitle Line with Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '1.25rem',
              }}
            >
              <p
                title={subtitle}
                style={{
                  fontSize: '0.86rem',
                  color: 'rgba(255, 255, 255, 0.92)',
                  fontWeight: 500,
                  margin: 0,
                  letterSpacing: '0.2px',
                }}
              >
                New episode coming on Saturday, Dec 7
              </p>
              {/* Small cute badge as seen in screenshot */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #FF3366, #E50914)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '2px 5px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  lineHeight: 1,
                  boxShadow: '0 2px 6px rgba(229, 9, 20, 0.4)',
                }}
              >
                TOP 10
              </span>
            </div>

            {/* Two Side-by-Side Action Buttons: [ ▶ Play Series ] and [ + My List ] */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
              }}
            >
              {/* Left Button: Play Series (White pill with black text and black play icon) */}
              <Link
                href="#rsvp"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '0.68rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.3px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.88)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Play size={18} fill="#000000" color="#000000" />
                <span>Play Series</span>
              </Link>

              {/* Right Button: + My List (Dark glass pill with white text) */}
              <button
                type="button"
                onClick={handleToggleMyList}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  backgroundColor: inMyList
                    ? 'rgba(229, 9, 20, 0.45)'
                    : 'rgba(55, 55, 55, 0.75)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  padding: '0.68rem 1rem',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  letterSpacing: '0.3px',
                  border: inMyList
                    ? '1px solid var(--accent-red)'
                    : '1px solid rgba(255, 255, 255, 0.22)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = inMyList
                    ? 'rgba(229, 9, 20, 0.6)'
                    : 'rgba(80, 80, 80, 0.85)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = inMyList
                    ? 'rgba(229, 9, 20, 0.45)'
                    : 'rgba(55, 55, 55, 0.75)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {inMyList ? <Check size={18} /> : <Plus size={18} />}
                <span>{inMyList ? 'In My List' : 'My List'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Pill (as shown at the bottom of the screenshot) */}
      <div
        style={{
          position: 'fixed',
          bottom: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 88,
          width: 'calc(100% - 32px)',
          maxWidth: '380px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(24, 24, 24, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            padding: '6px 8px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* 1. Home */}
          <Link
            href="#home"
            onClick={() => setActiveNavTab('home')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor:
                activeNavTab === 'home'
                  ? 'rgba(255, 255, 255, 0.14)'
                  : 'transparent',
              color: activeNavTab === 'home' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <HomeIcon size={19} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Home</span>
          </Link>

          {/* 2. Clips / Episodes */}
          <Link
            href="#story"
            onClick={() => setActiveNavTab('story')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor:
                activeNavTab === 'story'
                  ? 'rgba(255, 255, 255, 0.14)'
                  : 'transparent',
              color: activeNavTab === 'story' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Film size={19} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Episodes</span>
          </Link>

          {/* 3. Search / Details */}
          <Link
            href="#details"
            onClick={() => setActiveNavTab('details')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor:
                activeNavTab === 'details'
                  ? 'rgba(255, 255, 255, 0.14)'
                  : 'transparent',
              color: activeNavTab === 'details' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Search size={19} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600 }}>Details</span>
          </Link>

          {/* 4. My Netflix / RSVP */}
          <Link
            href="#rsvp"
            onClick={() => setActiveNavTab('rsvp')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '4px 14px',
              borderRadius: '9999px',
              backgroundColor:
                activeNavTab === 'rsvp'
                  ? 'rgba(229, 9, 20, 0.6)'
                  : 'transparent',
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <User size={19} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>RSVP</span>
          </Link>
        </div>
      </div>

      {/* Screen Cast Modal */}
      {showCastModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowCastModal(false)}
        >
          <div
            style={{
              backgroundColor: '#1f1f1f',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              maxWidth: '380px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
              animation: 'fadeIn 0.2s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cast size={20} color="var(--accent-red)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  Cast Wedding Premiere
                </h3>
              </div>
              <button
                onClick={() => setShowCastModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#aaa',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1.2rem' }}>
              Connect and watch the {groomName} & {brideName} celebration on your big screen:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { name: 'Living Room TV', type: 'AirPlay & Google Cast' },
                { name: 'Apple TV (Manila Hotel)', type: 'Reception Display' },
                { name: 'Cathedral Sanctuary Screen', type: 'Ceremony Stream' },
              ].map((device) => (
                <button
                  key={device.name}
                  onClick={() => {
                    setShowCastModal(false);
                    showToast(`Connected to ${device.name}! Streaming ready.`);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 9, 20, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{device.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#888' }}>{device.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories Selector Modal (Netflix Mobile Style) */}
      {showCategoriesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setShowCategoriesModal(false)}
        >
          <div
            style={{
              backgroundColor: '#181818',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              maxWidth: '420px',
              width: '100%',
              padding: '1.8rem 1.5rem',
              boxShadow: '0 24px 50px rgba(0,0,0,0.9)',
              animation: 'fadeIn 0.25s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.4rem',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                paddingBottom: '0.8rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
                Wedding Categories
              </h3>
              <button
                onClick={() => setShowCategoriesModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
              {[
                { label: 'Home & Premiere', href: '#home', tag: 'Featured' },
                { label: 'Our Story Episodes', href: '#story', tag: '3 Episodes' },
                { label: 'Wedding Details & Maps', href: '#details', tag: 'Cathedral & Hotel' },
                { label: 'Principal Sponsors', href: '#sponsors', tag: 'Ninongs & Ninangs' },
                { label: 'The Cast & Entourage', href: '#cast', tag: 'Bridal Party' },
                { label: 'Gift Guide & Registry', href: '#gift-guide', tag: 'Registry' },
                { label: 'Frequently Asked Questions', href: '#faqs', tag: 'FAQs' },
                { label: 'Confirm Your RSVP', href: '#rsvp', tag: 'Confirm Seat' },
                { label: 'Couple / Admin Portal', href: '/admin', tag: 'Admin' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setShowCategoriesModal(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(229, 9, 20, 0.15)';
                    e.currentTarget.style.borderColor = 'var(--accent-red)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  <span>{item.label}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid var(--accent-red)',
            color: '#ffffff',
            padding: '0.75rem 1.4rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 15px rgba(229, 9, 20, 0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
