"use client"; // OVO MORA BITI PRVA LINIJA

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  FaMicrophone, FaYoutube, FaNewspaper, FaProjectDiagram, 
  FaCrop, FaTimes, FaLinkedin, FaUserTie, FaHandshake, FaGlobe, FaCalendarAlt, FaClock, FaMapMarkerAlt 
} from "react-icons/fa";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop";

// Dinamički import za React Quill
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css'; 

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }], 
    ['bold', 'italic', 'underline', 'strike'], 
    [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
    ['link'], 
    ['clean'] 
  ],
};

// Prošireni interfejs
interface UnifiedItem {
  id: number;
  title: string;
  content?: string;
  type: string;
  image_url: string | null;
  gallery_urls?: string[] | null;
  created_at: string;
  video_duration?: string | null; 
  youtube_link?: string | null;
  slug?: string;
  website_url?: string | null;
  category?: string | null; 
  // Agenda specific
  time?: string | null;
  location?: string | null;
  speaker_ids?: number[] | null; // OVO JE PROMIJENJENO U NIZ
  speaker_name?: string | null; // Samo za prikaz u listi
}

export default function Admin() {
  const router = useRouter();
  
  const [authorized, setAuthorized] = useState(false); 

  const [items, setItems] = useState<UnifiedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Osnovni podaci
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 
  const [type, setType] = useState("news");
  
  // PODCAST / GOVORNIK SPECIFIČNI PODACI
  const [videoDuration, setVideoDuration] = useState(""); 
  const [youtubeLink, setYoutubeLink] = useState("");      

  // PARTNER SPECIFIČNI PODACI
  const [partnerUrl, setPartnerUrl] = useState("");
  const [partnerCategory, setPartnerCategory] = useState("bronze");

  // AGENDA SPECIFIČNI PODACI
  const [agendaTime, setAgendaTime] = useState("09:00");
  const [agendaCategory, setAgendaCategory] = useState("Main Stage");
  const [agendaLocation, setAgendaLocation] = useState("Hotel Borovi Sjenica");
  
  // *** OVO JE NOVO: Niz selektovanih govornika ***
  const [selectedSpeakerIds, setSelectedSpeakerIds] = useState<number[]>([]); 

  // Slike State
  const [coverImage, setCoverImage] = useState<File | null>(null); 
  const [coverPreview, setCoverPreview] = useState<string | null>(null); 
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]); 
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]); 

  // --- CROPPER STATE ---
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null); 

  useEffect(() => {
    const initAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace('/login');
      } else {
        setAuthorized(true);
        fetchAllData();
      }
    };
    
    initAdmin();
  }, [router]);

  // Fetchuje Posts, Partnere i Agendu
  async function fetchAllData() {
    // 1. Fetch Posts (News, Projects, Podcast/Speakers)
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    // 2. Fetch Partners
    const { data: partnersData } = await supabase
      .from("partners")
      .select("*")
      .order("created_at", { ascending: false });

    // 3. Fetch Agenda
    const { data: agendaData } = await supabase
      .from("agenda_items")
      .select("*") 
      .order("time", { ascending: true });

    // 4. Normalizacija podataka
    const formattedPartners: UnifiedItem[] = (partnersData || []).map((p: any) => ({
      id: p.id,
      title: p.name,
      type: 'partner',
      image_url: p.image_url,
      created_at: p.created_at,
      website_url: p.website_url,
      category: p.category
    }));

    const formattedPosts: UnifiedItem[] = (postsData || []).map((p: any) => ({
      ...p,
      type: p.type || 'news'
    }));

    const formattedAgenda: UnifiedItem[] = (agendaData || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      content: a.description,
      type: 'agenda',
      image_url: null, 
      created_at: a.created_at,
      time: a.time,
      category: a.category,
      location: a.location,
      speaker_ids: a.speaker_ids || [] // Učitavamo niz govornika
    }));

    // Spoji sve i sortiraj
    const combined = [...formattedAgenda, ...formattedPosts, ...formattedPartners].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    setItems(combined);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // --- CROPPER LOGIC ---
  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setTempImage(imageDataUrl as string);
      setIsCropping(true);
      setZoom(1);
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); 
      image.src = url;
    });

  async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("No 2d context");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.95);
    });
  }

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      if (!tempImage || !croppedAreaPixels) return;
      const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);
      const myFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
      setCoverImage(myFile);
      setCoverPreview(URL.createObjectURL(croppedBlob));
      setIsCropping(false);
      setTempImage(null);
    } catch (e) {
      console.error(e);
      alert("Greška pri isjecanju slike");
    }
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  // --- GALLERY HANDLERS ---
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (urlToRemove: string) => {
    setExistingGalleryUrls(prev => prev.filter(url => url !== urlToRemove));
  };

  const cleanHtml = (html: string) => {
    if (!html) return "";
    let clean = html;
    clean = clean.replace(/&nbsp;/g, ' ');
    clean = clean.replace(/style="[^"]*"/g, "");
    return clean;
  };

  // --- HELPERS ZA GOVORNIKE ---
  const addSpeaker = (idString: string) => {
    if (!idString) return;
    const id = parseInt(idString);
    if (!selectedSpeakerIds.includes(id)) {
        setSelectedSpeakerIds([...selectedSpeakerIds, id]);
    }
  };

  const removeSpeaker = (idToRemove: number) => {
    setSelectedSpeakerIds(selectedSpeakerIds.filter(id => id !== idToRemove));
  };

  // --- EDIT ---
  function handleEdit(item: UnifiedItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    
    // Reset inputs
    setContent("");
    setVideoDuration("");
    setYoutubeLink("");
    setPartnerUrl("");
    setPartnerCategory("bronze");
    setExistingGalleryUrls([]);
    
    // Reset agenda specific
    setAgendaTime("09:00");
    setAgendaCategory("Main Stage");
    setAgendaLocation("Hotel Borovi Sjenica");
    setSelectedSpeakerIds([]);

    if (item.type === 'partner') {
        setPartnerUrl(item.website_url || "");
        setPartnerCategory(item.category || "bronze");
        setCoverPreview(item.image_url);
    } else if (item.type === 'agenda') {
        setContent(item.content || "");
        setAgendaTime(item.time || "09:00");
        setAgendaCategory(item.category || "Main Stage");
        setAgendaLocation(item.location || "Hotel Borovi Sjenica");
        // Učitaj postojeće govornike ako ih ima
        setSelectedSpeakerIds(item.speaker_ids || []);
        setCoverPreview(null); 
    } else {
        // News, Project, Podcast
        setContent(item.content || "");
        setExistingGalleryUrls(item.gallery_urls || []);
        setVideoDuration(item.video_duration || "");
        setYoutubeLink(item.youtube_link || "");
        setCoverPreview(item.image_url);
    }

    setCoverImage(null);
    setGalleryFiles([]);
    window.scrollTo(0, 0); 
  }

  // --- RESET ---
  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setType("news"); 
    setCoverImage(null);
    setCoverPreview(null);
    setGalleryFiles([]);
    setExistingGalleryUrls([]);
    setVideoDuration(""); 
    setYoutubeLink(""); 
    setPartnerUrl("");
    setPartnerCategory("bronze");
    // Agenda reset
    setAgendaTime("09:00");
    setAgendaCategory("Main Stage");
    setAgendaLocation("Hotel Borovi Sjenica");
    setSelectedSpeakerIds([]);
  }

  // --- DELETE ---
  async function handleDelete(item: UnifiedItem) {
    if (!confirm("Da li ste sigurni da želite obrisati ovo?")) return;
    
    let error;
    if (item.type === 'partner') {
        const res = await supabase.from("partners").delete().eq("id", item.id);
        error = res.error;
    } else if (item.type === 'agenda') {
        const res = await supabase.from("agenda_items").delete().eq("id", item.id);
        error = res.error;
    } else {
        const res = await supabase.from("posts").delete().eq("id", item.id);
        error = res.error;
    }

    if (error) alert("Greška: " + error.message);
    else {
      alert("Obrisano!");
      fetchAllData(); 
    }
  }

  // --- PUBLISH / UPDATE ---
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validacija sadržaja (osim za partnere i agendu)
    if (type !== 'partner' && type !== 'agenda' && (!content || content === '<p><br></p>')) {
        alert("Molimo unesite tekst objave.");
        return;
    }

    setLoading(true);

    try {
      let finalCoverUrl = coverPreview; 
      
      // Upload Cover Slika (Agenda nema sliku)
      if (type !== 'agenda' && coverImage) {
        const fileName = `cover-${Date.now()}-${coverImage.name}`;
        const { error } = await supabase.storage.from("images").upload(fileName, coverImage);
        if (error) throw error;
        const { data: publicData } = supabase.storage.from("images").getPublicUrl(fileName);
        finalCoverUrl = publicData.publicUrl;
      }

      // Upload Galerija
      let finalGalleryUrls = [...existingGalleryUrls]; 
      if (type !== 'partner' && type !== 'podcast' && type !== 'agenda' && galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const fileName = `gallery-${Date.now()}-${file.name}`;
          const { error } = await supabase.storage.from("images").upload(fileName, file);
          if (!error) {
            const { data: publicData } = supabase.storage.from("images").getPublicUrl(fileName);
            finalGalleryUrls.push(publicData.publicUrl);
          }
        }
      }

      if (type === 'partner') {
        // --- LOGIKA ZA PARTNERE ---
        const partnerData = {
            name: title,
            image_url: finalCoverUrl,
            website_url: partnerUrl,
            category: partnerCategory
        };

        if(!finalCoverUrl) {
            alert("Partner mora imati logo!");
            setLoading(false);
            return;
        }

        if (editingId) {
            const { error } = await supabase.from("partners").update(partnerData).eq("id", editingId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from("partners").insert([partnerData]);
            if (error) throw error;
        }

      } else if (type === 'agenda') {
        // --- LOGIKA ZA AGENDU ---
        const cleanContentText = cleanHtml(content); 

        const agendaData = {
            time: agendaTime,
            title: title,
            category: agendaCategory,
            description: cleanContentText,
            location: agendaLocation,
            speaker_ids: selectedSpeakerIds // Šaljemo niz ID-eva u bazu
        };

        if (editingId) {
            const { error } = await supabase.from("agenda_items").update(agendaData).eq("id", editingId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from("agenda_items").insert([agendaData]);
            if (error) throw error;
        }

      } else {
        // --- LOGIKA ZA NOVOSTI, PROJEKTE, PODCAST ---
        const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        const cleanContentText = cleanHtml(content); 

        const postData = {
            title, 
            content: cleanContentText, 
            type: type, 
            slug,
            image_url: finalCoverUrl,
            gallery_urls: type === 'podcast' ? [] : finalGalleryUrls, 
            updated_at: new Date().toISOString(),
            video_duration: type === 'podcast' ? videoDuration : null,
            youtube_link: type === 'podcast' ? youtubeLink : null,
        };

        if (editingId) {
            const { error } = await supabase.from("posts").update(postData).eq("id", editingId);
            if (error) throw error;
        } else {
            const { error } = await supabase.from("posts").insert([postData]);
            if (error) throw error;
        }
      }

      alert("Uspješno sačuvano!");
      resetForm();
      fetchAllData(); 
    } catch (error: any) {
      alert("Greška: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Provjera pristupa...</h2>
        </div>
      </div>
    );
  }

  // Filtriramo govornike za Agenda dropdown (samo type 'podcast')
  const availableSpeakers = items.filter(i => i.type === 'podcast');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      {/* --- MODAL ZA ISJECANJE SLIKE --- */}
      {isCropping && tempImage && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90">
          <div className="relative flex-1 w-full bg-gray-900">
             <Cropper
              image={tempImage}
              crop={crop}
              zoom={zoom}
              aspect={(type === 'podcast' || type === 'partner') ? 1 / 1 : 16 / 9} 
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="bg-white p-6 flex flex-col gap-4 items-center pb-10">
            <div className="w-full max-w-md flex items-center gap-4">
               <span className="text-gray-500 text-sm">Zoom:</span>
               <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div className="flex gap-4">
                <button onClick={cancelCrop} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300">Otkaži</button>
                <button onClick={showCroppedImage} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"><FaCrop /> Isječi</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
             <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
             <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition flex items-center gap-2"><span>Odjavi se</span></button>
        </div>
        
        {/* FORMA */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-10 border border-gray-100">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {editingId ? "Uredi Sadržaj" : "Kreiraj Novi Sadržaj"}
            </h2>
            {editingId && (
              <button onClick={resetForm} className="text-sm text-red-500 hover:text-red-700 font-medium">✕ Otkaži</button>
            )}
          </div>

          <form onSubmit={handlePublish} className="space-y-8">
            
            {/* 1. TIP OBJAVE */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <label className="block text-sm font-bold text-gray-700 mb-3">Izaberite tip objave:</label>
                <div className="flex flex-wrap gap-4">
                    <label className={`flex items-center cursor-pointer group p-3 rounded border transition ${type === 'news' ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200'}`}>
                        <input type="radio" name="postType" value="news" checked={type === "news"} onChange={(e) => setType(e.target.value)} className="hidden" />
                        <span className={`flex items-center gap-2 font-medium ${type === 'news' ? 'text-blue-700' : 'text-gray-600'}`}><FaNewspaper /> Novost</span>
                    </label>
                    
                    <label className={`flex items-center cursor-pointer group p-3 rounded border transition ${type === 'project' ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}>
                        <input type="radio" name="postType" value="project" checked={type === "project"} onChange={(e) => setType(e.target.value)} className="hidden" />
                        <span className={`flex items-center gap-2 font-medium ${type === 'project' ? 'text-green-700' : 'text-gray-600'}`}><FaProjectDiagram /> Projekat</span>
                    </label>

                    <label className={`flex items-center cursor-pointer group p-3 rounded border transition ${type === 'podcast' ? 'bg-purple-50 border-purple-500' : 'bg-white border-gray-200'}`}>
                        <input type="radio" name="postType" value="podcast" checked={type === "podcast"} onChange={(e) => setType(e.target.value)} className="hidden" />
                        <span className={`flex items-center gap-2 font-medium ${type === 'podcast' ? 'text-purple-700' : 'text-gray-600'}`}><FaUserTie /> Govornik</span>
                    </label>

                    <label className={`flex items-center cursor-pointer group p-3 rounded border transition ${type === 'partner' ? 'bg-orange-50 border-orange-500' : 'bg-white border-gray-200'}`}>
                        <input type="radio" name="postType" value="partner" checked={type === "partner"} onChange={(e) => setType(e.target.value)} className="hidden" />
                        <span className={`flex items-center gap-2 font-medium ${type === 'partner' ? 'text-orange-700' : 'text-gray-600'}`}><FaHandshake /> Partner</span>
                    </label>

                    {/* AGENDA OPCIJA */}
                    <label className={`flex items-center cursor-pointer group p-3 rounded border transition ${type === 'agenda' ? 'bg-teal-50 border-teal-500' : 'bg-white border-gray-200'}`}>
                        <input type="radio" name="postType" value="agenda" checked={type === "agenda"} onChange={(e) => setType(e.target.value)} className="hidden" />
                        <span className={`flex items-center gap-2 font-medium ${type === 'agenda' ? 'text-teal-700' : 'text-gray-600'}`}><FaCalendarAlt /> Agenda</span>
                    </label>
                </div>
            </div>

            {/* 2. OSNOVNI PODACI */}
            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        {type === 'podcast' ? "Ime i Prezime Govornika" : type === 'partner' ? "Naziv Kompanije" : type === 'agenda' ? "Naziv Događaja (Panel, Pauza...)" : "Naslov"}
                    </label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900" placeholder="Unesite naziv..." required />
                </div>

                {/* Cover Slika (SAKRIVENO ZA AGENDU) */}
                {type !== 'agenda' && (
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        {type === 'podcast' ? "Fotografija Govornika" : type === 'partner' ? "Logo Partnera" : "Naslovna Slika"}
                      </label>
                      <input type="file" onChange={handleCoverChange} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
                      {coverPreview && (
                        <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border border-gray-200">
                           <Image src={coverPreview} alt="Cover preview" fill className="object-contain bg-slate-100" />
                           <button type="button" onClick={() => { setCoverPreview(null); setCoverImage(null); }} className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"><FaTimes size={12}/></button>
                        </div>
                      )}
                  </div>
                )}
            </div>

            {/* 3. AGENDA SPECIFIČNA POLJA */}
            {type === 'agenda' && (
                <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                    
                    {/* Vrijeme */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Vrijeme Događaja</label>
                        <div className="relative">
                            <FaClock className="absolute left-3 top-3.5 text-teal-600 text-xl" />
                            <input 
                                type="text" 
                                value={agendaTime} 
                                onChange={(e) => setAgendaTime(e.target.value)} 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-900" 
                                placeholder="09:00" 
                            />
                        </div>
                    </div>

                    {/* Kategorija */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Kategorija</label>
                        <select 
                            value={agendaCategory} 
                            onChange={(e) => setAgendaCategory(e.target.value)} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                        >
                            <option value="Main Stage">Main Stage</option>
                            <option value="Panel">Panel Diskusija</option>
                            <option value="Innovation">Inovacije</option>
                            <option value="Break">Pauza / Networking</option>
                            <option value="Competition">Takmičenje</option>
                        </select>
                    </div>

                    {/* Lokacija */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Lokacija</label>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-3.5 text-teal-600 text-xl" />
                            <input 
                                type="text" 
                                value={agendaLocation} 
                                onChange={(e) => setAgendaLocation(e.target.value)} 
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-900" 
                                placeholder="Unesite lokaciju" 
                            />
                        </div>
                    </div>

                    {/* Povezivanje Govornika - MULTI SELECT */}
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Dodaj Govornike</label>
                        
                        {/* Dropdown za odabir */}
                        <select 
                            onChange={(e) => {
                                addSpeaker(e.target.value);
                                e.target.value = ""; // Resetuj select nakon odabira
                            }} 
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-gray-900 mb-3"
                        >
                            <option value="">-- Izaberi govornika sa liste --</option>
                            {availableSpeakers.map(speaker => (
                                <option key={speaker.id} value={speaker.id}>
                                    {speaker.title}
                                </option>
                            ))}
                        </select>

                        {/* Prikaz selektovanih */}
                        <div className="flex flex-wrap gap-2">
                            {selectedSpeakerIds.length === 0 && (
                                <span className="text-sm text-gray-500 italic">Nema dodatih govornika.</span>
                            )}
                            {selectedSpeakerIds.map(id => {
                                const sp = availableSpeakers.find(s => s.id === id);
                                if (!sp) return null;
                                return (
                                    <div key={id} className="flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium border border-teal-200">
                                        <span>{sp.title}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => removeSpeaker(id)}
                                            className="text-teal-600 hover:text-red-500"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
            {/* 4. PARTNER SPECIFIČNA POLJA */}
            {type === 'partner' && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Kategorija Partnerstva</label>
                         <select 
                             value={partnerCategory} 
                             onChange={(e) => setPartnerCategory(e.target.value)} 
                             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                         >
                             <option value="general">👑 Generalni Pokrovitelj</option>
                             <option value="gold">🥇 Zlatni Sponzor</option>
                             <option value="silver">🥈 Srebreni Sponzor</option>
                             <option value="bronze">🥉 Bronzani Sponzor</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Websajt Link</label>
                         <div className="relative">
                             <FaGlobe className="absolute left-3 top-3.5 text-gray-400 text-xl" />
                             <input type="url" value={partnerUrl} onChange={(e) => setPartnerUrl(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-gray-900" placeholder="https://www.kompanija.com" />
                         </div>
                      </div>
                </div>
            )}

            {/* 5. PODCAST SPECIFIČNA POLJA */}
            {type === 'podcast' && (
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 grid md:grid-cols-2 gap-6 animate-fadeIn">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Zvanje / Titula</label>
                        <input type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="CEO, Founder..." />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-gray-700 mb-2">LinkedIn Profil</label>
                        <div className="relative">
                            <FaLinkedin className="absolute left-3 top-3.5 text-[#0077b5] text-xl" />
                            <input type="text" value={youtubeLink} onChange={(e) => setYoutubeLink(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900" placeholder="https://linkedin.com/in/..." />
                        </div>
                    </div>
                </div>
            )}

            {/* 6. GALERIJA (NIJE ZA PARTNERE, PODCAST I AGENDU) */}
            {type !== 'podcast' && type !== 'partner' && type !== 'agenda' && (
                <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Galerija slika</label>
                    <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700 cursor-pointer" />
                    <div className="mt-4 grid grid-cols-4 gap-2">
                        {existingGalleryUrls.map((url, idx) => (
                            <div key={`old-${idx}`} className="relative h-16 w-full rounded overflow-hidden group border border-gray-200">
                                <Image src={url} alt="Gallery item" fill className="object-cover" />
                                <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition">✕</button>
                            </div>
                        ))}
                        {galleryFiles.map((file, idx) => (
                            <div key={`new-${idx}`} className="relative h-16 w-full rounded overflow-hidden border-2 border-green-500">
                                <Image src={URL.createObjectURL(file)} alt="New upload" fill className="object-cover" />
                                <button type="button" onClick={() => removeGalleryFile(idx)} className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center text-xs">✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 7. EDITOR - SAKRIVEN ZA PARTNERE, VIDLJIV ZA AGENDU */}
            {type !== 'partner' && (
                <div className="mb-12">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                      {type === 'podcast' ? "Biografija Govornika" : type === 'agenda' ? "Opis Događaja" : "Tekst Objave"}
                  </label>
                  <div className="bg-white h-80 pb-12 rounded-lg overflow-hidden border border-gray-200 text-gray-900">
                    <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="h-full" placeholder="Pišite ovdje..." />
                  </div>
                </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg text-white font-bold text-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-0.5 ${
                loading ? "bg-gray-400 cursor-not-allowed" 
                : editingId ? "bg-green-600 hover:bg-green-700" 
                : type === 'podcast' ? "bg-purple-600 hover:bg-purple-700" 
                : type === 'partner' ? "bg-orange-500 hover:bg-orange-600"
                : type === 'agenda' ? "bg-teal-600 hover:bg-teal-700"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Obrađujem..." : editingId ? "Sačuvaj Izmjene" : "Objavi / Sačuvaj"}
            </button>
          </form>
        </div>

        {/* LISTA SVIH UNOSA */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
             <h2 className="text-xl font-bold text-gray-800">Svi unosi</h2>
             <p className="text-sm text-gray-500 mt-1">Lista svih novosti, projekata, govornika, partnera i agende.</p>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-6 hover:bg-gray-50 transition">
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                      {item.type === 'agenda' ? (
                        <div className="bg-teal-100 w-full h-full flex flex-col items-center justify-center text-teal-700">
                            <span className="font-bold text-lg">{item.time}</span>
                            <FaCalendarAlt size={20} className="mt-1 opacity-50"/>
                        </div>
                      ) : item.image_url ? (
                          <Image src={item.image_url} alt="thumb" fill className="object-cover" />
                      ) : (
                          <div className="flex items-center justify-center h-full text-gray-400 text-xs">No Image</div>
                      )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{item.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide flex items-center gap-1
                            ${item.type === 'project' ? 'bg-green-100 text-green-800' 
                            : item.type === 'podcast' ? 'bg-purple-100 text-purple-800' 
                            : item.type === 'partner' ? 'bg-orange-100 text-orange-800'
                            : item.type === 'agenda' ? 'bg-teal-100 text-teal-800'
                            : 'bg-blue-100 text-blue-800'}`}>
                            {item.type === 'podcast' ? 'Govornik' : item.type === 'project' ? 'Projekat' : item.type === 'partner' ? 'Partner' : item.type === 'agenda' ? 'Agenda' : 'Novost'}
                        </span>
                        
                        {item.type === 'partner' && <span className="text-orange-600 capitalize">({item.category})</span>}
                        {item.type === 'agenda' && <span className="text-teal-600 font-semibold">{item.category} • {item.location}</span>}
                        {item.type === 'agenda' && item.speaker_name && <span className="text-gray-500 text-xs border px-1 rounded">👤 {item.speaker_name}</span>}

                        <span className="text-gray-400 text-xs">{new Date(item.created_at).toLocaleDateString("bs-BA")}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => handleEdit(item)} className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50 font-medium transition shadow-sm">Uredi</button>
                  <button onClick={() => handleDelete(item)} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition shadow-sm">Obriši</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <div className="p-8 text-center text-gray-500">Nema unosa.</div>}
          </div>
        </div>

      </div>
    </div>
  );
}