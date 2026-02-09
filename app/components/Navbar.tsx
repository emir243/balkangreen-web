"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaLeaf } from "react-icons/fa"; // Dodao sam FaLeaf

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "O nama", href: "/onama" },
    { name: "Govornici", href: "/podcast" },
    { name: "Aktivnosti", href: "/blog" },
    { name: "Galerija", href: "/onama" },
    { name: "Partneri", href: "/onama" },
    { name: "Kontakt", href: "/kontakt", isButton: true }, // Označio sam Kontakt kao dugme
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    // Dodat backdrop-blur i blago providna boja za "stakleni" efekat
    <nav className="bg-[#0b1120]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO --- */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group" 
            onClick={closeMenu}
          >
            <div className="bg-green-500/10 p-2 rounded-lg group-hover:bg-green-500/20 transition-colors">
                <FaLeaf className="text-green-500 text-xl md:text-2xl" />
            </div>
            <div className="flex flex-col">
                <h1 className="text-lg md:text-xl font-bold tracking-wider uppercase leading-none text-white">
                  Balkan <span className="text-green-500">Green</span>
                </h1>
                <span className="text-[10px] md:text-xs text-gray-400 tracking-[0.2em] uppercase">Summit</span>
            </div>
          </Link>

          {/* --- DESKTOP MENI --- */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isButton ? (
                // Poseban dizajn za KONTAKT dugme
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-green-900/20 hover:shadow-green-500/30 transform hover:-translate-y-0.5"
                >
                  {link.name}
                </Link>
              ) : (
                // Standardni linkovi sa hover animacijom
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
                  {/* Linija koja se pojavljuje ispod */}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-300 ease-out ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              )
            ))}
          </div>

          {/* --- HAMBURGER DUGME --- */}
          <div className="md:hidden flex items-center">
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

      {/* --- MOBILNI MENI --- */}
      {/* Overlay pozadina */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={closeMenu}
      />

      {/* Slide-in meni */}
      <div
        className={`fixed top-[80px] left-0 right-0 bg-[#0b1120] border-b border-white/10 shadow-2xl md:hidden transform transition-transform duration-300 ease-in-out z-50 ${
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