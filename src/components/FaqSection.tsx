"use client";

import React, { useState } from 'react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'What is the dress code for the wedding?',
    answer: 'The dress code is Formal / Black Tie. Gentlemen may wear a dark suit and tie or Barong Tagalog. Ladies are requested to wear floor-length long gowns in cinematic shades (Black, Emerald Green, Midnight Blue, Wine/Burgundy). Please reserve shades of white, cream, and ivory for the bride.',
    order: 1,
  },
  {
    id: '2',
    question: 'Can I bring a plus one or additional guest?',
    answer: 'Due to venue capacity restrictions and our personalized seating arrangement, we can only accommodate guests officially listed on your invitation. When searching your name in the RSVP section, you will see the exact number of seats reserved in your honor.',
    order: 2,
  },
  {
    id: '3',
    question: 'Are children allowed at the wedding and reception?',
    answer: 'While we love your little ones, our celebration will be an adults-only event, with the exception of children participating in the wedding entourage. We hope this gives you an opportunity to relax and enjoy the night with us!',
    order: 3,
  },
  {
    id: '4',
    question: 'When is the deadline to RSVP?',
    answer: 'Please confirm your attendance by November 15, 2026. This allows us to finalize our catering count, tables, and personalized place cards with the venue.',
    order: 4,
  },
  {
    id: '5',
    question: 'What time should I arrive at the ceremony?',
    answer: 'The ceremony starts promptly at 3:00 PM at Manila Cathedral. We kindly advise arriving between 2:15 PM and 2:30 PM to allow time for parking, registration, and seating before the procession begins.',
    order: 5,
  },
  {
    id: '6',
    question: 'Is there parking available at both venues?',
    answer: 'Yes! Parking is available around Plaza Roma and nearby pay parking lots in Intramuros for the ceremony. At The Manila Hotel, complimentary valet and self-parking are provided for all our wedding guests.',
    order: 6,
  },
  {
    id: '7',
    question: 'Is it an unplugged ceremony?',
    answer: 'Yes, we kindly request an unplugged ceremony. We have hired an amazing team of photographers and videographers to capture our sacred moments. We invite you to be fully present with us and keep phones and cameras away during the church ceremony.',
    order: 7,
  },
];

interface FaqSectionProps {
  faqs?: FaqItem[];
}

export default function FaqSection({ faqs = [] }: FaqSectionProps) {
  const displayFaqs = faqs.length > 0 ? faqs : DEFAULT_FAQS;
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
        {displayFaqs.map((faq, index) => {
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
