import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A Love Story | Sandy & Bernadette",
  description: "Join us in celebrating our love story. The wedding of Sandy & Bernadette.",
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
