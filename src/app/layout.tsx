import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://the-bernales-wedding.vercel.app'),
  title: "A Love Story | Sandy & Bernadette",
  description: "Join us in celebrating our love story. The wedding of Sandy & Bernadette.",
  openGraph: {
    title: "A Love Story | Sandy & Bernadette",
    description: "Join us in celebrating our love story. The wedding of Sandy & Bernadette.",
    url: "https://the-bernales-wedding.vercel.app",
    siteName: "The Bernales Wedding",
    images: [
      {
        url: "https://3emzantd5ggd7ty7.public.blob.vercel-storage.com/uploads/1793057167853_Add_a_heading__2_.png",
        width: 1200,
        height: 630,
        alt: "A Love Story | Sandy & Bernadette Wedding Invitation",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Love Story | Sandy & Bernadette",
    description: "Join us in celebrating our love story. The wedding of Sandy & Bernadette.",
    images: ["https://3emzantd5ggd7ty7.public.blob.vercel-storage.com/uploads/1793057167853_Add_a_heading__2_.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
