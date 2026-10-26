"use client";

import React, { useState, useEffect } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isToday, setIsToday] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setIsToday(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isToday) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', animation: 'fadeIn 2s' }}>
        <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          Today is the day!
        </h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem) 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
        <h3
          style={{
            fontSize: 'clamp(1.1rem, 3.5vw, 1.45rem)',
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: '#ffffff',
            textTransform: 'uppercase',
            margin: '0 0 0.3rem 0',
          }}
        >
          Premiering Soon
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--gray-light)', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0 }}>
          Countdown to the Wedding Premiere
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'clamp(0.6rem, 3vw, 2.2rem)',
          justifyContent: 'center',
          textAlign: 'center',
          flexWrap: 'wrap',
        }}
      >
      {[
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 'clamp(60px, 18vw, 100px)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(0.6rem, 2vw, 1.2rem) clamp(0.5rem, 1.5vw, 1rem)',
            borderRadius: '8px',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(1.8rem, 5.5vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              fontFamily: 'monospace',
              textShadow: '0 0 12px rgba(229, 9, 20, 0.3)',
            }}
          >
            {item.value.toString().padStart(2, '0')}
          </span>
          <span
            style={{
              fontSize: 'clamp(0.65rem, 1.8vw, 0.8rem)',
              letterSpacing: '1.5px',
              color: 'var(--gray-light)',
              marginTop: '0.4rem',
              fontWeight: 600,
            }}
          >
            {item.label}
          </span>
        </div>
      ))}
      </div>
    </div>
  );
}
