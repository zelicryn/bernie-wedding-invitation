"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Our Story', href: '#story' },
    { label: 'Details', href: '#details' },
    { label: 'Sponsors', href: '#sponsors' },
    { label: 'The Cast', href: '#cast' },
    { label: 'Gift Guide', href: '#gift-guide' },
    { label: 'FAQs', href: '#faqs' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className="nav-glass"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 90,
          padding: isScrolled ? '0.6rem clamp(1rem, 4vw, 2.5rem)' : '1rem clamp(1rem, 4vw, 2.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          background: isScrolled ? 'rgba(14, 14, 14, 0.95)' : 'rgba(20, 20, 20, 0.8)',
          borderBottom: isScrolled ? '1px solid rgba(229, 9, 20, 0.25)' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.7)' : 'none',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo Monogram */}
        <Link
          href="#home"
          onClick={handleLinkClick}
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}
        >
          <div
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            <Image
              src="/logo.png"
              alt="S & B Monogram Logo"
              fill
              sizes="38px"
              style={{ objectFit: 'contain', padding: '2px' }}
            />
          </div>
          <span
            style={{
              color: 'var(--accent-red)',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            S & B
          </span>
        </Link>

        {/* Desktop Navigation Menu (hidden on mobile / tablets < 940px) */}
        <div className="desktop-nav-menu" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ul
            style={{
              display: 'flex',
              gap: '1.4rem',
              listStyle: 'none',
              fontWeight: 500,
              fontSize: '0.85rem',
              alignItems: 'center',
              margin: 0,
              padding: 0,
            }}
          >
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    transition: 'color 0.2s ease',
                    letterSpacing: '0.5px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Link
              href="#rsvp"
              style={{
                background: 'var(--accent-red)',
                color: '#fff',
                padding: '0.45rem 1.1rem',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '1px',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent-red)')}
            >
              RSVP
            </Link>

            <Link
              href="/admin"
              title="Bride & Groom Portal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              Couple Portal
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Controls (Visible on screens < 940px) */}
        <div className="mobile-nav-controls" style={{ display: 'none', alignItems: 'center', gap: '0.6rem' }}>
          <Link
            href="#rsvp"
            onClick={handleLinkClick}
            style={{
              background: 'var(--accent-red)',
              color: '#fff',
              padding: '0.4rem 0.85rem',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '1px',
              textDecoration: 'none',
            }}
          >
            RSVP
          </Link>

          {/* Hamburger / Close Icon Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              width: '42px',
              height: '42px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              padding: 0,
              color: '#fff',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '20px',
                height: '2px',
                backgroundColor: '#fff',
                borderRadius: '2px',
                transition: 'transform 0.25s ease, opacity 0.25s ease',
                transform: isMobileMenuOpen ? 'translateY(7px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '20px',
                height: '2px',
                backgroundColor: '#fff',
                borderRadius: '2px',
                transition: 'opacity 0.25s ease',
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '20px',
                height: '2px',
                backgroundColor: '#fff',
                borderRadius: '2px',
                transition: 'transform 0.25s ease, opacity 0.25s ease',
                transform: isMobileMenuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            top: '56px',
            background: 'rgba(12, 12, 12, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 85,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                color: 'var(--accent-red)',
                fontWeight: 700,
                marginBottom: '0.8rem',
                paddingLeft: '0.8rem',
              }}
            >
              Navigation
            </span>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 0.8rem',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#fff',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '6px',
                }}
              >
                <span>{link.label}</span>
                <span style={{ color: 'var(--accent-red)', fontSize: '1rem' }}>›</span>
              </Link>
            ))}

            <Link
              href="#rsvp"
              onClick={handleLinkClick}
              style={{
                marginTop: '1.2rem',
                background: 'var(--accent-red)',
                color: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1.05rem',
                textAlign: 'center',
                letterSpacing: '1px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(229, 9, 20, 0.4)',
              }}
            >
              CONFIRM RSVP
            </Link>
          </div>

          {/* Mobile Footer in Drawer */}
          <div
            style={{
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              textAlign: 'center',
            }}
          >
            <Link
              href="/admin"
              onClick={handleLinkClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.85)',
                padding: '0.85rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.12)',
                textDecoration: 'none',
              }}
            >
              Couple / Admin Portal
            </Link>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Sandy & Bernadette • December 7, 2026
            </p>
          </div>
        </div>
      )}

      {/* Global CSS for switching desktop / mobile navigation */}
      <style jsx>{`
        @media (max-width: 940px) {
          .nav-glass {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
