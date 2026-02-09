import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. IMPORTUJ TVOJE KOMPONENTE
// Proveri da li je putanja tačna. Ako koristiš alias, ovo je ok. 
// Ako ti javlja grešku, probaj: "../components/Navbar"
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moja Aplikacija",
  description: "Opis mog sajta",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* 2. NAVBAR NA VRH */}
        <Navbar />

        {/* 3. GLAVNI SADRŽAJ (Ovo su tvoje stranice) */}
        {/* Dodao sam flex-grow da gura footer dole */}
        <main className="flex-grow">
            {children}
        </main>

        {/* 4. FOOTER NA DNO */}
        <Footer />
      </body>
    </html>
  );
}