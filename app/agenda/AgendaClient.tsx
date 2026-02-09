"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import Link from "next/link"; 

// 1. Ažuriramo Interface da podržava niz govornika
interface Speaker {
  name: string;
  role?: string | null;
  slug?: string | null;
}

interface AgendaItemProps {
  id: string;
  time: string;
  title: string;
  category: string;
  description: string;
  location: string;
  // Podrška za niz govornika (novo)
  speakers?: Speaker[];
  // Podrška za starog jednog govornika (fallback)
  speaker?: Speaker | null;
}

export default function AgendaClient({ items }: { items: AgendaItemProps[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#050a05] text-white font-sans relative overflow-hidden py-20 px-4 sm:px-6">
      
      {/* POZADINA */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* NASLOV */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl sm:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full"
        >
          2026
        </motion.h1>
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
        >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                <span className="text-green-500">AGENDA</span> <span className="text-white">DOGAĐAJA</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Istražite vremenski okvir budućnosti. Kliknite na sesiju za detalje.
            </p>
        </motion.div>
      </div>

      {/* TIMELINE LISTA */}
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="absolute left-[27px] sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />

        <div className="space-y-6">
          {items.map((item, index) => {
            const isOpen = openId === item.id;

            // Logika: Ako ima 'speakers' (niz), koristi njega. Ako nema, probaj 'speaker' (jednina). Ako nema ni to, prazan niz.
            const displaySpeakers = item.speakers && item.speakers.length > 0 
                ? item.speakers 
                : (item.speaker ? [item.speaker] : []);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16 sm:pl-20"
              >
                {/* KRUŽIĆ */}
                <div 
                    className={`absolute left-[18px] sm:left-[7px] top-6 w-5 h-5 rounded-full border-2 transition-all duration-500 z-20 ${
                        isOpen 
                        ? "bg-green-500 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.8)] scale-125" 
                        : "bg-[#050a05] border-gray-600"
                    }`} 
                />

                {/* KARTICA */}
                <motion.div
                  layout 
                  onClick={() => toggleItem(item.id)}
                  className={`group cursor-pointer rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-500 ${
                    isOpen 
                    ? "bg-white/10 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {/* ZAGLAVLJE KARTICE */}
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        
                        <div className={`px-4 py-2 rounded-lg font-mono font-bold text-sm sm:text-base border ${
                            isOpen 
                            ? "bg-green-500 text-black border-green-400" 
                            : "bg-black/30 text-green-400 border-green-500/20"
                        }`}>
                            {item.time}
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 border border-gray-700 px-2 py-0.5 rounded-full">
                                    {item.category}
                                </span>
                            </div>
                            <h3 className={`text-xl font-bold transition-colors ${isOpen ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                                {item.title}
                            </h3>
                        </div>
                    </div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isOpen 
                        ? "bg-green-500 text-black border-green-400 rotate-180" 
                        : "bg-transparent text-gray-400 border-gray-700 group-hover:border-green-500 group-hover:text-green-500"
                    }`}>
                        {isOpen ? <FaMinus /> : <FaPlus />}
                    </div>
                  </div>

                  {/* PROŠIRENI SADRŽAJ */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-0 text-gray-400 border-t border-white/10 mt-2">
                           
                           {/* Opis */}
                           <div 
                             className="mt-4 leading-relaxed text-gray-300 [&>p]:mb-3"
                             dangerouslySetInnerHTML={{ __html: item.description }} 
                           />

                           <div className="flex flex-col sm:flex-row gap-6 mt-6 pt-4 border-t border-dashed border-white/10">
                                
                                {/* SEKCIJA GOVORNICI (LOOP) */}
                                {displaySpeakers.length > 0 && (
                                  <div className="flex items-start gap-3">
                                      <FaUserTie className="text-green-500 mt-1" />
                                      <div>
                                          <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                                              {displaySpeakers.length > 1 ? "Govornici" : "Govornik"}
                                          </p>
                                          
                                          {/* Petlja kroz sve govornike */}
                                          <div className="flex flex-col gap-2">
                                            {displaySpeakers.map((sp, idx) => (
                                              <div key={idx} className="text-sm text-white font-medium">
                                                  {sp.slug ? (
                                                      <Link 
                                                        href={`/blog/${sp.slug}?source=agenda`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="hover:text-green-400 hover:underline transition-colors cursor-pointer"
                                                      >
                                                        {sp.name}
                                                      </Link>
                                                  ) : (
                                                      <span>{sp.name}</span>
                                                  )}
                                                  
                                                  {sp.role && (
                                                    <span className="text-gray-500 text-xs ml-1 block sm:inline sm:ml-2">
                                                      {sp.role}
                                                    </span>
                                                  )}
                                              </div>
                                            ))}
                                          </div>

                                      </div>
                                  </div>
                                )}

                                {/* SEKCIJA LOKACIJA */}
                                <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="text-green-500 mt-1" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Lokacija</p>
                                        <p className="text-sm text-white font-medium">{item.location}</p>
                                    </div>
                                </div>
                           </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              </motion.div>
            );
          })}
          
          {items.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                Trenutno nema unesenih događaja u agendi.
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
                *Agenda je podložna promjenama. Sva vremena su u CET zoni.
            </p>
        </div>

      </div>
    </div>
  );
}