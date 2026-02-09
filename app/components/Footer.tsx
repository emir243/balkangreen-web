import Link from "next/link";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLeaf } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#050a14] text-white py-10 md:py-16 border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* GLAVNI KONTEJNER: 
            - Mobile/Tablet: flex-col (jedno ispod drugog)
            - Laptop/Desktop (lg): flex-row (jedno pored drugog) 
        */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-0">
          
          {/* --- 1. LOGO SEKCIJA --- */}
          <Link href="/" className="flex items-center gap-4 md:gap-5 group select-none">
             
             {/* Ikonica: Manja na mobitelu, veća na desktopu */}
             <div className="bg-white/5 p-3 md:p-4 rounded-xl border border-white/10 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-all duration-300">
                <FaLeaf className="text-green-500 text-2xl md:text-3xl lg:text-4xl transform group-hover:rotate-12 transition-transform duration-300" />
             </div>

             {/* Tekstualni dio */}
             <div className="flex flex-col items-start justify-center leading-none relative pt-2">
                
                {/* BALKAN: Responsive veličina */}
                <span className="text-white font-black text-2xl md:text-3xl lg:text-4xl uppercase tracking-tighter transform rotate-6 translate-y-2 translate-x-1 md:translate-x-2 z-0 text-shadow-sm">
                  Balkan
                </span>
                
                {/* GREEN: Responsive veličina */}
                <span className="text-green-500 font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter -mt-1 relative z-10 drop-shadow-2xl">
                  GREEN
                </span>
                
                {/* SUMMIT: Responsive veličina i razmak */}
                <span className="text-white font-bold text-sm md:text-lg lg:text-xl uppercase tracking-[0.35em] -mt-1 md:-mt-2 ml-1">
                  Summit
                </span>
             </div>
          </Link>

          {/* --- 2. KONTAKT INFO --- */}
          <div className="flex flex-col items-start space-y-5 w-full lg:w-auto lg:items-end">
              
              {/* Adresa */}
              <div className="flex items-start gap-4 text-gray-300 group hover:text-green-500 transition cursor-pointer lg:flex-row-reverse lg:text-right">
                  <FaMapMarkerAlt className="text-xl md:text-2xl text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-sm md:text-base lg:text-lg leading-relaxed">
                    Vreoca 59, Ilidža 71210 <br className="hidden sm:block"/>Kanton Sarajevo
                  </span>
              </div>
              
              {/* Telefon */}
              <a href="tel:+38766492044" className="flex items-center gap-4 text-gray-300 group hover:text-green-500 transition lg:flex-row-reverse lg:text-right">
                  <FaPhone className="text-xl md:text-2xl text-green-600 flex-shrink-0" />
                  <span className="text-sm md:text-base lg:text-lg font-medium">+387 66 492 044</span>
              </a>
              
              {/* Email */}
              <a href="mailto:info@balkangreen.com" className="flex items-center gap-4 text-gray-300 group hover:text-green-500 transition lg:flex-row-reverse lg:text-right">
                  <FaEnvelope className="text-xl md:text-2xl text-green-600 flex-shrink-0" />
                  <span className="text-sm md:text-base lg:text-lg font-medium">info@balkangreen.com</span>
              </a>
          </div>

        </div>

        {/* --- COPYRIGHT LINIJA --- */}
        <div className="border-t border-gray-800 mt-10 md:mt-12 pt-6 md:pt-8 text-center lg:text-center">
          <p className="text-gray-500 text-xs md:text-sm lg:text-base">
            &copy; {new Date().getFullYear()} Balkan Green Summit. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;