const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Default Settings
  const defaultSettings = [
    { key: 'wedding_title', value: 'A Love Story' },
    { key: 'bride_name', value: 'Bernadette' },
    { key: 'groom_name', value: 'Sandy' },
    { key: 'wedding_subtitle', value: 'Two hearts. One story. A lifetime together.' },
    { key: 'wedding_date', value: '2026-12-07T15:00:00' },
    { key: 'hero_badge', value: 'NETFLIX ORIGINAL LOVE STORY' },
    { key: 'hero_bg_image', value: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80' },
    { key: 'couple_photo', value: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80' },
    { key: 'logo_text', value: 'S & B' },
    { key: 'ceremony_title', value: 'The Ceremony' },
    { key: 'ceremony_time', value: '3:00 PM' },
    { key: 'ceremony_venue', value: 'Manila Cathedral' },
    { key: 'ceremony_address', value: 'Cabildo cor. Beaterio St., Intramuros, Manila, Philippines' },
    { key: 'ceremony_map_link', value: 'https://maps.google.com/?q=Manila+Cathedral' },
    { key: 'reception_title', value: 'The Celebration' },
    { key: 'reception_time', value: '6:00 PM' },
    { key: 'reception_venue', value: 'The Manila Hotel' },
    { key: 'reception_address', value: '1 Rizal Park, Ermita, Manila, Philippines' },
    { key: 'reception_map_link', value: 'https://maps.google.com/?q=The+Manila+Hotel' },
    { key: 'dress_code_title', value: 'Dress Code: Black Tie / Formal' },
    { key: 'dress_code_desc', value: 'Gentlemen: Tuxedo, Dark Suit & Tie, or Barong Tagalog.\nLadies: Elegant Floor-Length Gowns in dark cinematic tones (Emerald, Midnight Blue, Burgundy, or Black).' },
    { key: 'gift_title', value: 'Gift Guide' },
    { key: 'gift_message', value: 'With all that we have, we’ve been truly blessed.\nYour presence and prayers are all that we request.\nHowever, if you wish to honor us with a gift to help us build our new home and future,\na monetary gift would be warmly appreciated.' },
    { key: 'rsvp_deadline', value: 'November 15, 2026' },
    { key: 'admin_pin', value: '1234' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Check if principal sponsors exist
  const sponsorCount = await prisma.principalSponsor.count();
  if (sponsorCount === 0) {
    await prisma.principalSponsor.createMany({
      data: [
        { name: 'Hon. Roberto Tan', gender: 'MALE', role: 'Principal Sponsor', order: 1 },
        { name: 'Dr. Evelyn Tan', gender: 'FEMALE', role: 'Principal Sponsor', order: 2 },
        { name: 'Mr. Antonio Morales', gender: 'MALE', role: 'Principal Sponsor', order: 3 },
        { name: 'Mrs. Cynthia Morales', gender: 'FEMALE', role: 'Principal Sponsor', order: 4 },
        { name: 'Atty. Fernando Reyes', gender: 'MALE', role: 'Principal Sponsor', order: 5 },
        { name: 'Mrs. Maria Elena Reyes', gender: 'FEMALE', role: 'Principal Sponsor', order: 6 },
        { name: 'Engr. Danilo Ramos', gender: 'MALE', role: 'Principal Sponsor', order: 7 },
        { name: 'Mrs. Corazon Ramos', gender: 'FEMALE', role: 'Principal Sponsor', order: 8 },
      ],
    });
  }

  // Check if gift options exist
  const giftCount = await prisma.giftOption.count();
  if (giftCount === 0) {
    await prisma.giftOption.createMany({
      data: [
        {
          type: 'GCash',
          bankName: 'GCash',
          accountName: 'Bernadette S. / Sandy M.',
          accountNumber: '0917 123 4567',
          note: 'Scan or send via GCash mobile app',
          order: 1,
        },
        {
          type: 'Maya',
          bankName: 'Maya',
          accountName: 'Sandy M.',
          accountNumber: '0918 987 6543',
          note: 'Maya E-Wallet Transfer',
          order: 2,
        },
        {
          type: 'Bank Transfer',
          bankName: 'BDO Unibank',
          accountName: 'Sandy Morales or Bernadette Santos',
          accountNumber: '0012 3456 7890',
          note: 'Savings Account',
          order: 3,
        },
        {
          type: 'Bank Transfer',
          bankName: 'BPI',
          accountName: 'Bernadette Santos',
          accountNumber: '1234 5678 90',
          note: 'Current/Savings Account',
          order: 4,
        },
      ],
    });
  }

  // Check if FAQs exist
  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: 'What is the dress code for the wedding?',
          answer: 'The dress code is Formal / Black Tie. Gentlemen may wear a dark suit and tie or Barong Tagalog. Ladies are requested to wear floor-length long gowns in cinematic shades (Black, Emerald Green, Midnight Blue, Wine/Burgundy). Please reserve shades of white, cream, and ivory for the bride.',
          order: 1,
        },
        {
          question: 'Can I bring a plus one or additional guest?',
          answer: 'Due to venue capacity restrictions and our personalized seating arrangement, we can only accommodate guests officially listed on your invitation. When searching your name in the RSVP section, you will see the exact number of seats reserved in your honor.',
          order: 2,
        },
        {
          question: 'Are children allowed at the wedding and reception?',
          answer: 'While we love your little ones, our celebration will be an adults-only event, with the exception of children participating in the wedding entourage. We hope this gives you an opportunity to relax and enjoy the night with us!',
          order: 3,
        },
        {
          question: 'When is the deadline to RSVP?',
          answer: 'Please confirm your attendance by November 15, 2026. This allows us to finalize our catering count, tables, and personalized place cards with the venue.',
          order: 4,
        },
        {
          question: 'What time should I arrive at the ceremony?',
          answer: 'The ceremony starts promptly at 3:00 PM at Manila Cathedral. We kindly advise arriving between 2:15 PM and 2:30 PM to allow time for parking, registration, and seating before the procession begins.',
          order: 5,
        },
        {
          question: 'Is there parking available at both venues?',
          answer: 'Yes! Parking is available around Plaza Roma and nearby pay parking lots in Intramuros for the ceremony. At The Manila Hotel, complimentary valet and self-parking are provided for all our wedding guests.',
          order: 6,
        },
        {
          question: 'Is it an unplugged ceremony?',
          answer: 'Yes, we kindly request an unplugged ceremony. We have hired an amazing team of photographers and videographers to capture our sacred moments. We invite you to be fully present with us and keep phones and cameras away during the church ceremony.',
          order: 7,
        },
      ],
    });
  }

  // Check if episodes exist
  const episodeCount = await prisma.episode.count();
  if (episodeCount === 0) {
    await prisma.episode.createMany({
      data: [
        {
          title: 'The Pilot Episode: The First Hello',
          date: 'June 2020',
          description: 'A shared conversation over a quiet coffee that unexpectedly turned into hours of laughter, discovering how two very different worlds fit so effortlessly together.',
          photoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
          order: 1,
        },
        {
          title: 'Season 2: Adventures Across the Miles',
          date: 'March 2022',
          description: 'From scenic road trips to exploring foreign streets, overcoming life storms and celebrating every little milestone hand-in-hand.',
          photoUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
          order: 2,
        },
        {
          title: 'The Season Finale: Under the Stars',
          date: 'December 2024',
          description: 'With trembling hands and a heart full of devotion, Sandy asked the question that changed everything — and Bernadette said yes with tears of joy.',
          photoUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
          order: 3,
        },
      ],
    });
  }

  // Check if entourage exists
  const entourageCount = await prisma.entourage.count();
  if (entourageCount === 0) {
    await prisma.entourage.createMany({
      data: [
        { name: 'Maria Santos', role: 'Maid of Honor', category: 'Bridal Party', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', order: 1 },
        { name: 'Juan Cruz', role: 'Best Man', category: 'Groomsmen', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', order: 2 },
        { name: 'Camille Reyes', role: 'Bridesmaid', category: 'Bridal Party', photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', order: 3 },
        { name: 'Mark Bautista', role: 'Groomsman', category: 'Groomsmen', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', order: 4 },
        { name: 'Patricia Gomez', role: 'Bridesmaid', category: 'Bridal Party', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80', order: 5 },
        { name: 'David Lee', role: 'Groomsman', category: 'Groomsmen', photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80', order: 6 },
      ],
    });
  }

  // Check if guests exist
  const guestCount = await prisma.guest.count();
  if (guestCount === 0) {
    await prisma.guest.createMany({
      data: [
        { name: 'Maria Santos', seats: 2, status: 'PENDING' },
        { name: 'Juan Cruz', seats: 2, status: 'PENDING' },
        { name: 'Camille Reyes', seats: 1, status: 'PENDING' },
        { name: 'Mark Bautista', seats: 2, status: 'PENDING' },
        { name: 'David Lee', seats: 1, status: 'PENDING' },
        { name: 'Patricia Gomez', seats: 1, status: 'PENDING' },
        { name: 'Roberto Tan', seats: 2, status: 'CONFIRMED', attendingCount: 2, accompanyingNames: 'Dr. Evelyn Tan' },
        { name: 'Sandy & Berny VIP Family', seats: 4, status: 'PENDING' },
      ],
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
