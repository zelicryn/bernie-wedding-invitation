"use client";

import React, { useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

interface FaqSectionProps {
  faqs?: FaqItem[];
}

export default function FaqSection({ faqs = [] }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First open by default

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="section-padding container" style={{ maxWidth: '900px' }}>
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
          Everything You Need To Know
        </span>
        <h2 className="section-title" style={{ marginBottom: '1rem' }}>
          Frequently Asked Questions
        </h2>
        <p
          style={{
            fontSize: '1.15rem',
            color: 'var(--gray-light)',
            fontStyle: 'italic',
            margin: '0 auto',
            maxWidth: '600px',
          }}
        >
          Have questions about our big day? Here are answers to the most common inquiries.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.id}
              className="fade-in"
              style={{
                background: isOpen ? 'var(--gray-dark)' : 'rgba(26,26,26,0.6)',
                borderRadius: '8px',
                border: isOpen ? '1px solid var(--accent-red)' : '1px solid var(--gray-medium)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  padding: '1.4rem 1.8rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      color: isOpen ? 'var(--accent-red)' : 'var(--gray-light)',
                      fontWeight: 700,
                      fontSize: '1rem',
                      minWidth: '24px',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '0.3px' }}>
                    {faq.question}
                  </span>
                </div>
                <div
                  style={{
                    color: isOpen ? 'var(--accent-red)' : 'var(--gray-light)',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease, color 0.3s ease',
                    fontSize: '1.8rem',
                    lineHeight: '1',
                    marginLeft: '1rem',
                    flexShrink: 0,
                  }}
                >
                  +
                </div>
              </button>

              {isOpen && (
                <div
                  style={{
                    padding: '0 1.8rem 1.6rem 3.4rem',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '1.05rem',
                    lineHeight: 1.7,
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    paddingTop: '1rem',
                    animation: 'fadeIn 0.3s ease-in-out',
                  }}
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <p style={{ color: 'var(--gray-light)', fontSize: '0.95rem' }}>
          Still have other questions? Feel free to message Sandy or Bernadette directly!
        </p>
      </div>
    </section>
  );
}
