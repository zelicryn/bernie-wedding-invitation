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
    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
      {[
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.3)' }}>
            {item.value.toString().padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '2px', color: 'var(--gray-light)' }}>
            {item.label}
          </span>
          {index < 3 && (
            <span style={{ position: 'absolute', transform: 'translateX(40px) translateY(15px)', color: 'var(--accent-red)' }}>•</span>
          )}
        </div>
      ))}
    </div>
  );
}
