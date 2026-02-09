"use client";

import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaLeaf, FaAtom, FaGlobeAmericas } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function KontaktPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // 0 = Registracija, 1 = Upit
  const [selectedTab, setSelectedTab] = useState(0); 
  const isRegister = selectedTab === 0;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulacija
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  // Animacija za Swipe sadržaja
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    // GLAVNA POZADINA - Tamna, duboka zelena sa radijalnim sjajem
    <div className="min-h-screen bg-[#050a05] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Pozadinski "Aurora" efekti */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- GLAVNA KARTICA (GLASSMORPHISM) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-green-900/20 rounded-3xl overflow-hidden z-10"
      >
        
        {/* --- LIJEVA STRANA (INFO) - Zauzima 2/5 prostora --- */}
        <div className="lg:col-span-2 bg-gradient-to-b from-green-900/40 to-[#020402]/80 p-10 text-white flex flex-col justify-between relative">
           {/* Ukrasne linije */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
           
           <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <FaLeaf className="text-green-400 text-xl" />
                </div>
                <span className="text-sm font-mono text-green-400 tracking-widest uppercase">Balkan Green Summit</span>
              </div>
              
              <h2 className="text-4xl font-bold mb-4 tracking-tight leading-tight">
                Budućnost je <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                  Zelena & Digitalna
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Povežite se sa liderima održivog razvoja. Vaše putovanje počinje jednim klikom.
              </p>
           </div>

           {/* Futuristički info boxovi */}
           <div className="space-y-6 mt-10 lg:mt-0">
             {[
               { icon: FaPhoneAlt, title: "Pozovite nas", val: "+387 61 123 456" },
               { icon: FaEnvelope, title: "Pišite nam", val: "info@bgsummit.com" },
               { icon: FaMapMarkerAlt, title: "Baza", val: "Sarajevo, HQ" }
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-4 group">
                 <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-[#050a05] group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                   <item.icon />
                 </div>
                 <div>
                   <p className="text-xs text-green-500/70 font-bold uppercase tracking-wider">{item.title}</p>
                   <p className="text-gray-300 group-hover:text-white transition-colors">{item.val}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* --- DESNA STRANA (FORMA) - Zauzima 3/5 prostora --- */}
        <div className="lg:col-span-3 p-8 sm:p-12 bg-black/20 relative">
          
          {success ? (
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-10"
            >
              <div className="w-24 h-24 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <FaCheckCircle className="text-5xl text-green-400 drop-shadow-lg" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Transmisija Uspješna!</h3>
              <p className="text-gray-400 mb-8 max-w-sm">Vaši podaci su sigurno pohranjeni u našu bazu. Kontaktirat ćemo vas uskoro.</p>
              <button onClick={() => setSuccess(false)} className="px-6 py-2 rounded-full border border-green-500/50 text-green-400 hover:bg-green-500/10 transition">Nova poruka</button>
            </motion.div>
          ) : (
            <>
                {/* --- HEADER DESNE STRANE --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <h2 className="text-2xl font-bold text-white">Pokreni zahtjev</h2>
                    
                    {/* --- FUTURISTIC SWIPE TOGGLE --- */}
                    <div className="bg-black/40 border border-white/10 p-1 rounded-full flex relative w-full sm:w-64 backdrop-blur-md">
                        {/* The Glowing Pill (Active State) */}
                        <motion.div 
                            className="absolute top-1 bottom-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] z-0"
                            initial={false}
                            animate={{ 
                                left: isRegister ? "4px" : "50%", 
                                width: "calc(50% - 4px)" 
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />

                        <button 
                            onClick={() => setSelectedTab(0)}
                            className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 ${isRegister ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FaAtom className={isRegister ? "animate-spin-slow" : ""} /> Registracija
                        </button>

                        <button 
                            onClick={() => setSelectedTab(1)}
                            className={`flex-1 relative z-10 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2 ${!isRegister ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <FaGlobeAmericas /> Info Upit
                        </button>
                    </div>
                </div>

                {/* --- FORMA --- */}
                <form onSubmit={handleSubmit} className="relative min-h-[350px]">
                    <AnimatePresence mode="wait" custom={selectedTab}>
                        <motion.div
                            key={selectedTab}
                            custom={selectedTab}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* INPUT: IME */}
                                <div className="group">
                                    <label className="block text-xs font-bold text-green-500/80 mb-2 uppercase tracking-wider ml-1">Identitet</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 focus:bg-white/10 focus:ring-1 focus:ring-green-500/50 outline-none transition-all duration-300 backdrop-blur-sm"
                                        placeholder="UNESITE IME"
                                    />
                                </div>
                                {/* INPUT: EMAIL */}
                                <div className="group">
                                    <label className="block text-xs font-bold text-green-500/80 mb-2 uppercase tracking-wider ml-1">Digitalna Adresa</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 focus:bg-white/10 focus:ring-1 focus:ring-green-500/50 outline-none transition-all duration-300 backdrop-blur-sm"
                                        placeholder="EMAIL@PRIMJER.COM"
                                    />
                                </div>
                            </div>

                            {/* TEXTAREA */}
                            <div>
                                <label className="block text-xs font-bold text-green-500/80 mb-2 uppercase tracking-wider ml-1">
                                    {isRegister ? "Podaci o entitetu / firmi" : "Parametri Upita"}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:border-green-500 focus:bg-white/10 focus:ring-1 focus:ring-green-500/50 outline-none transition-all duration-300 resize-none backdrop-blur-sm"
                                    placeholder={isRegister ? "UNESITE DETALJE ZA REGISTRACIJU..." : "OPIŠITE VAŠ ZAHTJEV..."}
                                ></textarea>
                            </div>

                            {/* SUBMIT BUTTON */}
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34,197,94,0.5)" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className={`w-full text-black font-black uppercase tracking-widest py-5 rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                                    isRegister 
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                    : 'bg-gradient-to-r from-teal-400 to-cyan-500'
                                }`}
                            >
                                {/* Shine effect */}
                                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
                                
                                <span className="relative z-10 flex items-center gap-2">
                                    {loading ? "PROCESIRANJE..." : (isRegister ? "POTVRDI REGISTRACIJU" : "POŠALJI SIGNAL")} 
                                    {!loading && <FaPaperPlane className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                </span>
                            </motion.button>

                        </motion.div>
                    </AnimatePresence>
                </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}