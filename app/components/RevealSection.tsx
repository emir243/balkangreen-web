"use client";

import { useEffect, useRef, useState } from "react";

export default function RevealSection({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Kad element postane vidljiv (čak i 15%), pokreni animaciju
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Prekini posmatranje nakon što se pojavi (da ne treperi)
        }
      },
      {
        threshold: 0.15, // 15% elementa mora biti vidljivo
        rootMargin: "0px 0px -50px 0px" // Malo pomjeri liniju okidanja
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ease-out ${
        isVisible 
          ? "opacity-100 translate-y-0 filter blur-0" 
          : "opacity-0 translate-y-20 filter blur-sm"
      }`}
    >
      {children}
    </div>
  );
}