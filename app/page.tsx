import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    // Glavni kontejner - Tamna pozadina kao i Navbar/Footer
    <div className="flex min-h-screen flex-col bg-[#0b1120] text-white font-sans selection:bg-green-500/30">
      
      {/* --- HERO SEKCIJA --- */}
      <main className="flex flex-grow flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        
        {/* Pozadinski zeleni sjaj (Blur effect) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {/* --- BADGE / MALI NASLOV --- */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-green-400 text-sm font-semibold mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Prijave su otvorene za 2024.
        </div>

        {/* --- GLAVNI NASLOV --- */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6 relative z-10">
          <span className="block text-white mb-2">BALKAN</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 drop-shadow-lg">
            GREEN SUMMIT
          </span>
        </h1>

        {/* --- PODNASLOV / INFO --- */}
        <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Pridružite se liderima, inovatorima i vizionarima na najvećem regionalnom događaju posvećenom održivoj budućnosti i zelenoj energiji.
        </p>

        {/* --- DETALJI (Datum i Lokacija) --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-300 mb-10 font-medium">
            <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-green-500" />
                <span>15. - 17. Oktobar 2024.</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 bg-gray-600 rounded-full" />
            <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-500" />
                <span>Sarajevo, Bosna i Hercegovina</span>
            </div>
        </div>

        {/* --- DUGMAD --- */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/kontakt" 
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white text-lg font-bold rounded-xl transition-all duration-300 shadow-lg shadow-green-900/40 hover:shadow-green-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            Registruj se
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/agenda" 
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-lg font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
          >
            Saznaj više
          </Link>
        </div>

      </main>

    </div>
  );
}