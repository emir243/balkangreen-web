import Link from "next/link";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#050a14] text-white py-12 md:py-16 border-t border-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-start space-y-10">
          
          {/* --- LOGO / NAZIV --- */}
          <Link href="/" className="group block">
             <div className="flex flex-col items-start justify-center">
                 {/* Balkan Green - Zelenim slovima */}
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-green-600 tracking-wide uppercase leading-none">
                   Balkan Green
                 </h2>
                 {/* Summit - Belim slovima ispod */}
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-wide uppercase leading-none mt-2">
                   Summit
                 </h2>
             </div>
          </Link>

          {/* --- KONTAKT INFO --- */}
          <div className="flex flex-col items-start space-y-5 md:space-y-6 w-full max-w-md">
              
              {/* Adresa */}
              <div className="flex items-start gap-4 text-gray-300 group hover:text-green-500 transition cursor-pointer">
                  <FaMapMarkerAlt className="text-xl md:text-2xl text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-base md:text-lg leading-relaxed">
                    Vreoca 59, Ilidža 71210 <br className="hidden sm:block"/>Kanton Sarajevo
                  </span>
              </div>
              
              {/* Telefon */}
              <a href="tel:+38766492044" className="flex items-center gap-4 text-gray-300 group hover:text-green-500 transition">
                  <FaPhone className="text-xl md:text-2xl text-green-600 flex-shrink-0" />
                  <span className="text-base md:text-lg font-medium">+387 66 492 044</span>
              </a>
              
              {/* Email */}
              <a href="mailto:info@balkangreen.com" className="flex items-center gap-4 text-gray-300 group hover:text-green-500 transition">
                  <FaEnvelope className="text-xl md:text-2xl text-green-600 flex-shrink-0" />
                  <span className="text-base md:text-lg font-medium">info@balkangreen.com</span>
              </a>
          </div>

        </div>

        {/* COPYRIGHT LINIJA */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-left md:text-center">
          <p className="text-gray-500 text-sm md:text-base">
            &copy; {new Date().getFullYear()} Balkan Green Summit. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;