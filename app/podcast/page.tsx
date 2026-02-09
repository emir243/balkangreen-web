"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from 'next/image';
import { FaLinkedin, FaChevronDown, FaChevronUp, FaMicrophone } from 'react-icons/fa';

// INTERFEJS (Mapiranje polja iz baze na novu namjenu)
interface SpeakerPost {
  id: number;
  title: string;          // Ime i Prezime
  content: string;        // Biografija
  created_at: string;
  image_url: string | null;
  video_duration?: string; // OVO JE SADA TITULA (npr. "CEO of Company")
  guest_name?: string;     // Ovo polje možemo ignorisati ili koristiti za nešto drugo
  youtube_link?: string;   // OVO JE SADA LINKEDIN LINK
  type: string;
}

export default function Podcast() {
  const [speakers, setSpeakers] = useState<SpeakerPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State za praćenje koja kartica je otvorena (id govornika)
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  async function fetchSpeakers() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("type", "podcast") // Zadržali smo tip 'podcast' da ne moraš mijenjati bazu
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setSpeakers(data as SpeakerPost[]);
      }
    } catch (error) {
      console.error("Greška pri učitavanju govornika:", error);
    } finally {
      setLoading(false);
    }
  }

  const toggleBio = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null); // Zatvori ako je već otvoren
    } else {
      setExpandedId(id); // Otvori novi
    }
  };

  // Helper za čišćenje HTML tagova iz teksta (ako ih ima iz editora)
  const cleanText = (html: string | null) => {
    if (!html) return "";
    let str = html.replace(/<[^>]+>/g, ' ');
    return str.trim();
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      
      {/* 1. HERO SEKCIJA - GOVORNICI */}
      <div className="relative bg-slate-900 py-20 px-6 lg:px-8 overflow-hidden mb-12">
        {/* Dekorativni krugovi */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-green-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase">
                GOVORNICI
            </h1>
            <div className="w-24 h-1 bg-green-500 mx-auto mt-6 rounded-full"></div>
            <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto">
                Upoznajte stručnjake i vizionare koji oblikuju našu budućnost.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
        
        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20 text-slate-500">Učitavanje govornika...</div>
        )}

        {/* 2. GRID GOVORNIKA */}
        {!loading && speakers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {speakers.map((speaker) => (
                    <div key={speaker.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 flex flex-col">
                        
                        {/* Slika Govornika */}
                        <div className="relative h-80 w-full bg-slate-200 group cursor-pointer" onClick={() => toggleBio(speaker.id)}>
                            {speaker.image_url ? (
                                <Image 
                                    src={speaker.image_url} 
                                    alt={speaker.title}
                                    fill
                                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-slate-400 flex-col">
                                    <FaMicrophone className="text-4xl mb-2 opacity-50" />
                                    <span>Nema slike</span>
                                </div>
                            )}
                            
                            {/* LinkedIn Overlay Dugme */}
                            {speaker.youtube_link && (
                                <a 
                                    href={speaker.youtube_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-[#0077b5] hover:scale-110 transition-transform shadow-md z-10"
                                    onClick={(e) => e.stopPropagation()} // Da ne otvori karticu kad se klikne link
                                >
                                    <FaLinkedin size={24} />
                                </a>
                            )}
                        </div>

                        {/* Podaci o govorniku */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-1">
                                    {speaker.title}
                                </h3>
                                {/* Ovdje prikazujemo 'video_duration' kao Titulu */}
                                <p className="text-green-600 font-medium text-sm uppercase tracking-wider">
                                    {speaker.video_duration || "Gost govornik"}
                                </p>
                            </div>

                            {/* Biografija (Expandable) */}
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedId === speaker.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pt-4 border-t border-slate-100 text-slate-600 text-sm leading-relaxed pb-4">
                                    {/* Prikazujemo content kao HTML ili čisti tekst */}
                                    <div dangerouslySetInnerHTML={{ __html: speaker.content }} />
                                </div>
                            </div>

                            {/* Dugme Saznaj više */}
                            <div className="mt-auto pt-4">
                                <button 
                                    onClick={() => toggleBio(speaker.id)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-colors group"
                                >
                                    {expandedId === speaker.id ? "Manje o govorniku" : "Saznaj više"}
                                    {expandedId === speaker.id ? (
                                        <FaChevronUp className="text-xs transition-transform" />
                                    ) : (
                                        <FaChevronDown className="text-xs transition-transform group-hover:translate-y-1" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

      {/* Ako nema podataka */}
        {!loading && speakers.length === 0 && (
            <div className="w-full py-24 flex items-center justify-center">
                <h2 className="text-slate-300 font-bold text-4xl tracking-widest uppercase select-none">
                    Uskoro
                </h2>
            </div>
        )}

      </div>
    </div>
  );
}