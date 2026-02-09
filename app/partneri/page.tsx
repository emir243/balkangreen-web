"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FaExternalLinkAlt, FaCrown, FaMedal } from "react-icons/fa";

// Definiramo tip podataka za Partnera
interface Partner {
  id: number;
  name: string;
  image_url: string;
  website_url: string; // Link na koji vodi klik
  category: string;    // 'general', 'gold', 'silver', 'bronze'
}

export default function PartneriPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: true }); // Možeš sortirati po želji

      if (error) {
        console.error("Greška prilikom učitavanja partnera:", error);
      } else {
        setPartners(data as Partner[]);
      }
      setLoading(false);
    };

    fetchPartners();
  }, []);

  // Filtriranje partnera po kategorijama
  const general = partners.filter((p) => p.category === "general");
  const gold = partners.filter((p) => p.category === "gold");
  const silver = partners.filter((p) => p.category === "silver");
  const bronze = partners.filter((p) => p.category === "bronze");

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* NASLOV STRANICE */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Naši Partneri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zahvaljujemo se našim sponzorima i partnerima koji su omogućili realizaciju ovog projekta.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* ------------------------------------------------ */}
        {/* 1. GENERALNI POKROVITELJ (Najveći, Centriran)    */}
        {/* ------------------------------------------------ */}
        {general.length > 0 && (
          <section className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center gap-3 uppercase tracking-widest">
              <FaCrown className="text-blue-600 text-4xl" /> Generalni Pokrovitelj
            </h2>
            
            <div className="flex justify-center">
              {general.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
                >
                  <div className="aspect-w-16 aspect-h-9 md:h-64 flex items-center justify-center p-4">
                    <img
                      src={partner.image_url}
                      alt={partner.name || "Generalni pokrovitelj"}
                      className="max-h-full max-w-full object-contain filter group-hover:brightness-110 transition duration-300"
                    />
                  </div>
                  {/* Labela na hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                    <FaExternalLinkAlt />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------ */}
        {/* 2. ZLATNI SPONZORI (Grid 2 kolone, Zlatni okvir) */}
        {/* ------------------------------------------------ */}
        {gold.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
            <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px w-16 bg-yellow-400"></div>
                <h2 className="text-2xl font-bold text-yellow-600 uppercase tracking-widest flex items-center gap-2">
                  <FaMedal className="text-3xl" /> Zlatni Sponzori
                </h2>
                <div className="h-px w-16 bg-yellow-400"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {gold.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl p-8 shadow-lg border-2 border-yellow-200 hover:border-yellow-400 hover:bg-yellow-50/30 transition-all duration-300 flex items-center justify-center h-48 relative overflow-hidden"
                >
                  <img
                    src={partner.image_url}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-yellow-100/50 rounded-2xl pointer-events-none transition-colors"></div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------ */}
        {/* 3. SREBRENI SPONZORI (Grid 3 kolone, Sivi okvir) */}
        {/* ------------------------------------------------ */}
        {silver.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-px w-12 bg-gray-300"></div>
                <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <FaMedal className="text-2xl" /> Srebreni Sponzori
                </h2>
                <div className="h-px w-12 bg-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {silver.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl p-6 shadow md:shadow-md border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 flex items-center justify-center h-40"
                >
                  <img
                    src={partner.image_url}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ------------------------------------------------ */}
        {/* 4. BRONZANI SPONZORI (Grid 4 kolone, Manji)      */}
        {/* ------------------------------------------------ */}
        {bronze.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-10 bg-orange-300"></div>
                <h2 className="text-lg font-bold text-orange-700 uppercase tracking-widest flex items-center gap-2">
                  <FaMedal className="text-xl" /> Bronzani Sponzori
                </h2>
                <div className="h-px w-10 bg-orange-300"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
              {bronze.map((partner) => (
                <a
                  key={partner.id}
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-lg p-4 shadow-sm border border-orange-100 hover:border-orange-300 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center h-32"
                >
                  <img
                    src={partner.image_url}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Poruka ako nema partnera */}
        {partners.length === 0 && !loading && (
           <div className="text-center py-20">
              <p className="text-gray-400">Trenutno nema dodanih partnera.</p>
           </div>
        )}

      </div>
    </div>
  );
}