"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";
import { 
  FaCalendar, 
  FaArrowLeft, 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp, 
  FaLinkedin,
  FaUserTie,
  FaExternalLinkAlt
} from "react-icons/fa";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url?: string | null;
  gallery_urls?: string[] | null;
  slug: string;
  type: string; // 'news', 'podcast', 'project'
  video_duration?: string | null;
  guest_name?: string | null;
  youtube_link?: string | null; // OVO KORISTIMO ZA LINKEDIN LINK KOD GOVORNIKA
}

export default function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  
  const { slug } = use(params);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Za swipe funkcionalnost
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const fetchPost = async () => {
      const isId = !isNaN(Number(slug));

      let query = supabase.from("posts").select("*");

      if (isId) {
        query = query.eq("id", slug);
      } else {
        query = query.eq("slug", slug);
      }

      const { data, error } = await query.limit(1);

      if (error) {
          console.error("Supabase error:", error.message);
      } else if (data && data.length > 0) {
          setPost(data[0] as Post);
      } else {
          setPost(null);
      }
      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  // --- FUNKCIJE ZA LISTANJE SLIKA (Lightbox) ---
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden'; 
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto'; 
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (post?.gallery_urls && lightboxIndex !== null) {
      setLightboxIndex((prev) => 
        prev === post.gallery_urls!.length - 1 ? 0 : prev! + 1
      );
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (post?.gallery_urls && lightboxIndex !== null) {
      setLightboxIndex((prev) => 
        prev === 0 ? post.gallery_urls!.length - 1 : prev! - 1
      );
    }
  };

  // --- SWIPE LOGIKA ZA MOBITEL ---
  const minSwipeDistance = 50; 

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage(); // Swipe lijevo -> sljedeća slika
    }
    if (isRightSwipe) {
      prevImage(); // Swipe desno -> prethodna slika
    }
  };

  // Tastatura navigacija
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") {
         if (post?.gallery_urls) setLightboxIndex((prev) => (prev === post.gallery_urls!.length - 1 ? 0 : prev! + 1));
      }
      if (e.key === "ArrowLeft") {
         if (post?.gallery_urls) setLightboxIndex((prev) => (prev === 0 ? post.gallery_urls!.length - 1 : prev! - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, post]);


  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-500">Učitavanje...</div>;
  
  if (!post) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sadržaj nije pronađen</h1>
        <p className="text-gray-500 mb-6">Moguće je da je stranica premještena ili obrisana.</p>
        <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Nazad na početnu
        </Link>
    </div>
  );

  // --- DINAMIČKO ODREĐIVANJE LABELA I BOJA ---
  let labelText = "Novost";
  let badgeColorDesktop = "bg-blue-600 text-white";
  let badgeColorMobile = "bg-blue-100 text-blue-700";
  let backLinkText = "Nazad na novosti";
  let backLinkUrl = "/blog";

  if (post.type === 'podcast') {
      // GOVORNIK POSTAVKE
      labelText = "Govornik";
      badgeColorDesktop = "bg-green-600 text-white"; // Zelena kao na karticama
      badgeColorMobile = "bg-green-100 text-green-700";
      backLinkText = "Nazad na aktivnosti";
      backLinkUrl = "/blog";
  } else if (post.type === 'project') {
      labelText = "Projekat";
      badgeColorDesktop = "bg-purple-600 text-white"; 
      badgeColorMobile = "bg-purple-100 text-purple-700";
      backLinkText = "Nazad na projekte";
      backLinkUrl = "/blog"; 
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* HEADER SLIKA */}
      {post.image_url ? (
        <div className="container mx-auto px-0 md:px-4 mt-0 md:mt-6">
            <div className="relative w-full h-[500px] md:h-[650px] md:rounded-3xl overflow-hidden shadow-none md:shadow-lg bg-black">
            <Image 
                src={post.image_url} 
                alt={post.title} 
                fill 
                className={`object-contain md:object-cover ${post.type === 'podcast' ? 'md:object-top' : ''}`}
                priority
            />
            {/* Gradient samo na desktopu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent hidden md:block"></div>
            
            {/* Tekst preko slike (samo desktop) */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white hidden md:block">
                <Link href={backLinkUrl} className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm transition font-medium">
                    <FaArrowLeft className="mr-2" /> {backLinkText}
                </Link>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 ${badgeColorDesktop}`}>
                        {post.type === 'podcast' && <FaUserTie />} {labelText}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-200 font-medium">
                        <FaCalendar /> {new Date(post.created_at).toLocaleDateString("bs-BA")}
                    </span>
                </div>
                <h1 className="text-5xl font-bold leading-tight drop-shadow-sm max-w-4xl text-balance">{post.title}</h1>
            </div>
            </div>
        </div>
      ) : null}

      {/* GLAVNI SADRŽAJ */}
      <div className="container mx-auto px-6 mt-8 md:mt-12 max-w-4xl">
         
         {/* Mobilni Naslov i Info */}
         <div className="block md:hidden mb-8">
            <Link href={backLinkUrl} className="text-blue-600 hover:underline mb-4 inline-flex items-center font-medium text-sm">
               <FaArrowLeft className="mr-2" /> {backLinkText}
            </Link>
            <div className="flex flex-wrap gap-2 mb-3">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${badgeColorMobile}`}>
                        {post.type === 'podcast' && <FaUserTie className="text-[10px]" />} {labelText}
                 </span>
                 <span className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                        <FaCalendar /> {new Date(post.created_at).toLocaleDateString("bs-BA")}
                 </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight text-balance">{post.title}</h1>
         </div>

         {/* SOCIAL SHARE */}
         <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
             <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Podijeli:</span>
             <div className="flex gap-3">
                 <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition" title="Facebook">
                    <FaFacebook />
                 </a>
                 <a href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${post.title}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition" title="X (Twitter)">
                    <FaTwitter />
                 </a>
                 <a href={`https://wa.me/?text=${post.title} - ${currentUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition" title="WhatsApp">
                    <FaWhatsapp />
                 </a>
                 <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-800 text-white flex items-center justify-center hover:bg-blue-900 transition" title="LinkedIn">
                    <FaLinkedin />
                 </a>
             </div>
         </div>
         
         {/* NASLOV "BIOGRAFIJA" AKO JE GOVORNIK */}
         {post.type === 'podcast' && (
             <div className="mb-6">
                 <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-green-500 pl-4 uppercase tracking-wide">
                     Biografija
                 </h2>
             </div>
         )}

         {/* --- TEKST (SADRŽAJ) --- */}
         <div 
           lang="bs"
           className="prose prose-lg max-w-none w-full text-gray-700 mb-12 
           text-left break-words hyphens-none
           
           prose-headings:font-bold prose-headings:text-gray-900 
           prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
           
           prose-p:my-0 prose-p:leading-relaxed [&>p]:min-h-[1.5rem]

           prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
           prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
           prose-li:pl-1 prose-li:marker:text-blue-600

           prose-a:text-blue-600 hover:prose-a:text-blue-800"
           
           dangerouslySetInnerHTML={{ __html: post.content }}
         />
         
         {/* LINKEDIN SEKCIJA (Umjesto YouTube-a) */}
         {post.type === 'podcast' && post.youtube_link && (
             <div className="bg-blue-50 rounded-2xl p-6 md:p-8 mb-12 border border-blue-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 group hover:shadow-md transition-shadow duration-300">
                 
                 <div className="flex items-center gap-4">
                     <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                         <FaLinkedin />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-gray-900 mb-1">
                             Povežite se sa govornikom
                         </h3>
                         <p className="text-blue-700 font-medium text-sm">
                             Posjetite profesionalni profil
                         </p>
                     </div>
                 </div>

                 <a 
                    href={post.youtube_link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full md:w-auto px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                 >
                    Posjeti LinkedIn Profil <FaExternalLinkAlt className="text-sm" />
                 </a>
             </div>
         )}

         {post.gallery_urls && post.gallery_urls.length > 0 && (
           <div className="border-t pt-12">
             <h3 className="text-2xl font-bold mb-8 text-gray-900">Galerija slika</h3>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {post.gallery_urls.map((url, index) => (
                 <div 
                   key={index} 
                   className="relative h-48 cursor-pointer group overflow-hidden rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100"
                   onClick={() => openLightbox(index)}
                 >
                   <Image 
                     src={url} 
                     alt={`Gallery ${index}`} 
                     fill 
                     className="object-cover group-hover:scale-110 transition duration-700" 
                   />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                     <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-4xl drop-shadow-lg transform scale-50 group-hover:scale-100 transition duration-300">+</span>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxIndex !== null && post.gallery_urls && (
        <div 
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200"
            onClick={closeLightbox} 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50 bg-white/10 rounded-full hover:bg-white/20 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button 
            onClick={prevImage}
            className="absolute left-2 md:left-4 text-white/70 hover:text-white p-2 md:p-3 z-50 bg-white/10 md:bg-transparent rounded-full transition"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
             </svg>
          </button>

          <div className="relative w-full h-full p-2 md:p-10 flex items-center justify-center pointer-events-none">
            <div className="relative pointer-events-auto max-w-full max-h-full">
                <Image 
                    src={post.gallery_urls[lightboxIndex]} 
                    alt="Full screen" 
                    width={1920} 
                    height={1080}
                    className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
                    quality={100}
                    priority 
                />
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center text-white/80 font-medium text-sm tracking-widest uppercase">
                {lightboxIndex + 1} / {post.gallery_urls.length}
            </div>
          </div>

          <button 
            onClick={nextImage}
            className="absolute right-2 md:right-4 text-white/70 hover:text-white p-2 md:p-3 z-50 bg-white/10 md:bg-transparent rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 md:w-10 md:h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}