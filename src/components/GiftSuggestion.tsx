"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export interface GiftOptionItem {
  id: string;
  type: string;
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  qrCodeUrl?: string | null;
  note?: string | null;
  order?: number;
}

const DEFAULT_GIFTS: GiftOptionItem[] = [
  {
    id: '1',
    type: 'GCash',
    bankName: 'GCash',
    accountName: 'Bernadette S. / Sandy M.',
    accountNumber: '0917 123 4567',
    note: 'Scan or send via GCash mobile app',
    order: 1,
  },
  {
    id: '2',
    type: 'Maya',
    bankName: 'Maya',
    accountName: 'Sandy M.',
    accountNumber: '0918 987 6543',
    note: 'Maya E-Wallet Transfer',
    order: 2,
  },
  {
    id: '3',
    type: 'Bank Transfer',
    bankName: 'BDO Unibank',
    accountName: 'Sandy Morales or Bernadette Santos',
    accountNumber: '0012 3456 7890',
    note: 'Savings Account',
    order: 3,
  },
  {
    id: '4',
    type: 'Bank Transfer',
    bankName: 'BPI',
    accountName: 'Bernadette Santos',
    accountNumber: '1234 5678 90',
    note: 'Current/Savings Account',
    order: 4,
  },
];

interface GiftSuggestionProps {
  giftMessage?: string;
  options?: GiftOptionItem[];
}

export default function GiftSuggestion({ giftMessage, options = [] }: GiftSuggestionProps) {
  const displayOptions = options.length > 0 ? options : DEFAULT_GIFTS;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [zoomedQr, setZoomedQr] = useState<{ url: string; title: string } | null>(null);

  const defaultMessage =
    "With all that we have, we’ve been truly blessed.\nYour presence and prayers are all that we request.\nHowever, if you wish to honor us with a gift to help us build our new home and future,\na monetary gift would be warmly appreciated.";

  const handleCopy = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="gift-guide" className="section-padding container">
      {/* Zoomed QR Modal */}
      {zoomedQr && (
        <div
          onClick={() => setZoomedQr(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1f1f1f',
              border: '1px solid var(--gray-medium)',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '380px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem', color: '#fff' }}>
              {zoomedQr.title} QR Code
            </h4>
            <div
              style={{
                width: '100%',
                aspectRatio: '1/1',
                position: 'relative',
                background: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                padding: '12px',
                marginBottom: '1.5rem',
              }}
            >
              <Image src={zoomedQr.url} alt="QR Code" fill style={{ objectFit: 'contain', padding: '8px' }} />
            </div>
            <p style={{ color: 'var(--gray-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Scan directly from your mobile banking or e-wallet app.
            </p>
            <button onClick={() => setZoomedQr(null)} className="btn-secondary" style={{ width: '100%' }}>
              Close
            </button>
          </div>
        </div>
      )}

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
          Love & Gratitude
        </span>
        <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
          Gift Suggestion
        </h2>

        {/* Cinematic Card with Poem */}
        <div
          className="fade-in"
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            background: 'linear-gradient(180deg, rgba(30,30,30,0.8) 0%, rgba(18,18,18,0.9) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderLeft: '4px solid var(--accent-red)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ marginBottom: '1.2rem', color: 'var(--accent-red)', display: 'flex', justifyContent: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 12 20 22 4 22 4 12"></polyline>
              <rect x="2" y="7" width="20" height="5"></rect>
              <line x1="12" y1="22" x2="12" y2="7"></line>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
          </div>
          <p
            style={{
              fontSize: '1.15rem',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.9)',
              fontStyle: 'italic',
              whiteSpace: 'pre-line',
            }}
          >
            {giftMessage || defaultMessage}
          </p>
        </div>
      </div>

      {/* Gift Channels Grid */}
      {displayOptions.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {displayOptions.map((opt) => {
            const isGCash = opt.type.toLowerCase().includes('gcash') || opt.bankName?.toLowerCase().includes('gcash');
            const isMaya = opt.type.toLowerCase().includes('maya') || opt.bankName?.toLowerCase().includes('maya');
            const badgeColor = isGCash ? '#007DFE' : isMaya ? '#18C74F' : 'var(--accent-red)';

            return (
              <div
                key={opt.id}
                className="fade-in"
                style={{
                  background: 'var(--gray-dark)',
                  borderRadius: '12px',
                  border: '1px solid var(--gray-medium)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = badgeColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--gray-medium)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                    <span
                      style={{
                        background: `${badgeColor}22`,
                        color: badgeColor,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        border: `1px solid ${badgeColor}44`,
                      }}
                    >
                      {opt.bankName || opt.type}
                    </span>
                    {opt.qrCodeUrl && (
                      <button
                        onClick={() => setZoomedQr({ url: opt.qrCodeUrl!, title: opt.bankName || opt.type })}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--gray-light)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                        }}
                        title="View QR Code"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        View QR
                      </button>
                    )}
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                    {opt.accountName || 'Account Name'}
                  </h4>

                  {opt.accountNumber && (
                    <div
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        padding: '0.8rem 1rem',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '1rem',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '1px', color: '#fff' }}>
                        {opt.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(opt.id, opt.accountNumber!)}
                        style={{
                          background: copiedId === opt.id ? '#2e7d32' : 'rgba(255,255,255,0.15)',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {copiedId === opt.id ? 'COPIED!' : 'COPY'}
                      </button>
                    </div>
                  )}

                  {opt.note && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)', marginTop: '0.8rem', lineHeight: 1.5 }}>
                      {opt.note}
                    </p>
                  )}
                </div>

                {opt.qrCodeUrl && (
                  <div
                    onClick={() => setZoomedQr({ url: opt.qrCodeUrl!, title: opt.bankName || opt.type })}
                    style={{
                      marginTop: '1.5rem',
                      background: '#fff',
                      borderRadius: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      position: 'relative',
                      height: '140px',
                    }}
                  >
                    <Image src={opt.qrCodeUrl} alt="QR Code" fill style={{ objectFit: 'contain', padding: '6px' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Wishing Well Envelope Note */}
      <div
        style={{
          marginTop: '3.5rem',
          textAlign: 'center',
          padding: '1.5rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          border: '1px dashed var(--gray-medium)',
          maxWidth: '650px',
          margin: '3.5rem auto 0',
        }}
      >
        <p style={{ fontSize: '0.95rem', color: 'var(--gray-light)', margin: 0 }}>
          A wishing well box will also be warmly prepared at the reception for traditional envelopes and greeting cards.
        </p>
      </div>
    </section>
  );
}
