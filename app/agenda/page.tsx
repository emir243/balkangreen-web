import { supabase } from "@/lib/supabaseClient"; // 1. Uvozimo Supabase umjesto Prisme
import AgendaClient from "./AgendaClient";

export const runtime = 'edge';
export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  // 1. Povlačimo stavke agende preko Supabase-a
  const { data: rawAgendaItems, error: agendaError } = await supabase
    .from('agenda_items')
    .select('*')
    .order('time', { ascending: true });

  if (agendaError) {
    console.error("Greška pri povlačenju agende:", agendaError);
  }

  const items = rawAgendaItems || [];

  // 2. Sakupljamo sve ID-eve govornika iz svih agenda itema u jedan niz
  const allSpeakerIds = items.flatMap((item) => item.speaker_ids || []);

  // 3. Povlačimo podatke o govornicima koji se nalaze u tom nizu
  let speakersData: any[] = [];
  if (allSpeakerIds.length > 0) {
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .in('id', allSpeakerIds);

    if (postsError) {
      console.error("Greška pri povlačenju govornika:", postsError);
    } else if (posts) {
      speakersData = posts;
    }
  }

  // 4. Pripremamo podatke za klijenta (Spajamo agendu i govornike)
  const agendaItems = items.map((item) => {
    
    // ČISTIMO OPIS OD HTML TAGOVA
    const cleanDescription = item.description 
      ? item.description.replace(/<[^>]+>/g, '') 
      : "";

    // FILTRIRAMO GOVORNIKE ZA OVAJ KONKRETAN ITEM
    // Tražimo govornike čiji se ID nalazi u item.speaker_ids nizu
    const itemSpeakers = speakersData.filter(speaker => 
      item.speaker_ids && item.speaker_ids.includes(speaker.id)
    );

    // Mapiramo govornike u format za frontend
    const formattedSpeakers = itemSpeakers.map(speaker => ({
        name: speaker.guest_name || speaker.title || "Gost",
        role: speaker.guest_name ? speaker.title : null,
        slug: speaker.slug,
        image: speaker.image_url,
    }));

    return {
      id: item.id.toString(),
      time: item.time,
      title: item.title,
      category: item.category,
      description: cleanDescription, 
      location: item.location || "",
      // Šaljemo niz govornika umjesto jednog
      speakers: formattedSpeakers, 
      // Zadržavamo 'speaker' polje zbog kompatibilnosti ako AgendaClient očekuje jedan objekt (uzimamo prvog)
      speaker: formattedSpeakers.length > 0 ? formattedSpeakers[0] : null 
    };
  });

  return (
    <AgendaClient items={agendaItems} />
  );
}