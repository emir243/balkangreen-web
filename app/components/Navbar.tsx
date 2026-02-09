"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaLeaf } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Agenda", href: "/agenda" },
    { name: "Govornici", href: "/podcast" },
    { name: "Aktivnosti", href: "/blog" },
    { name: "Galerija", href: "/onama" },
    { name: "Partneri", href: "/partneri" },
    { name: "Registruj se", href: "/kontakt", isButton: true },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-[#0b1120]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* --- LOGO SEKCIJA --- */}
          <Link 
            href="/" 
            className="flex items-center gap-4 group" 
            onClick={closeMenu}
          >
            {/* Ikonica Lista - sakrivena na najmanjim ekranima, vidljiva na sm */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-all duration-300 hidden sm:block">
                <FaLeaf className="text-green-500 text-2xl transform group-hover:rotate-12 transition-transform duration-300" />
            </div>

            {/* Tekstualni dio Loga */}
            <div className="flex flex-col items-center justify-center leading-none select-none relative pt-2">
                
                {/* Gornji red: BALKAN */}
                <span className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter transform rotate-6 translate-y-2 translate-x-2 z-0 text-shadow-sm">
                  Balkan
                </span>
                
                {/* Srednji red: GREEN */}
                <span className="text-green-500 font-black text-4xl md:text-5xl tracking-tighter -mt-1 relative z-10 drop-shadow-2xl">
                  GREEN
                </span>
                
                {/* Donji red: SUMMIT */}
                <span className="text-white font-bold text-lg md:text-xl uppercase tracking-[0.35em] -mt-2 ml-1">
                  Summit
                </span>
            </div>
          </Link>

          {/* --- DESKTOP MENI (Samo na LG i većim ekranima) --- */}
          {/* Promijenjeno: md:flex -> lg:flex */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isButton ? (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-green-900/20 hover:shadow-green-500/30 transform hover:-translate-y-0.5"
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative group py-2"
                >
                  <span className={`${
                    pathname === link.href ? "text-white" : "text-gray-300 group-hover:text-white"
                  } text-sm font-medium uppercase tracking-wide transition-colors`}>
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-300 ease-out ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              )
            ))}
          </div>

          {/* --- HAMBURGER DUGME (Vidljivo na tabletima i mobitelima) --- */}
          {/* Promijenjeno: md:hidden -> lg:hidden */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-green-500 focus:outline-none p-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBILNI / TABLET MENI OVERLAY --- */}
      {/* Promijenjeno: md:hidden -> lg:hidden */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* --- MOBILNI / TABLET MENI SADRŽAJ --- */}
      {/* Promijenjeno: md:hidden -> lg:hidden */}
      <div
        className={`fixed top-[96px] left-0 right-0 bg-[#0b1120] border-b border-white/10 shadow-2xl lg:hidden transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-y-0" : "-translate-y-[150%]"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4 items-center justify-center min-h-[50vh]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className={`text-lg font-medium tracking-wide uppercase px-8 py-3 rounded-xl w-full text-center transition-all ${
                link.isButton 
                ? "bg-green-600 text-white shadow-lg mt-4 hover:bg-green-500" 
                : pathname === link.href 
                  ? "text-green-400 bg-white/5" 
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;