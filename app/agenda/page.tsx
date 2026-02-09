import { prisma } from "@/lib/prisma";
import AgendaClient from "./AgendaClient";

export const dynamic = "force-dynamic";

export default async function AgendaPage() {
  // 1. Povlačimo stavke agende (BEZ include posts, jer relacija više ne postoji)
  const rawAgendaItems = await prisma.agenda_items.findMany({
    orderBy: {
      time: 'asc',
    },
  });

  // 2. Sakupljamo sve ID-eve govornika iz svih agenda itema u jedan niz
  // flatMap pretvara [[1,2], [3], []] u [1, 2, 3]
  const allSpeakerIds = rawAgendaItems.flatMap((item) => item.speaker_ids);

  // 3. Povlačimo podatke o govornicima koji se nalaze u tom nizu
  const speakersData = await prisma.posts.findMany({
    where: {
      id: { in: allSpeakerIds }, // Prisma zna raditi sa BigInt nizovima ovdje
    },
  });

  // 4. Pripremamo podatke za klijenta (Spajamo agendu i govornike)
  const agendaItems = rawAgendaItems.map((item) => {
    
    // ČISTIMO OPIS OD HTML TAGOVA
    const cleanDescription = item.description 
      ? item.description.replace(/<[^>]+>/g, '') 
      : "";

    // FILTRIRAMO GOVORNIKE ZA OVAJ KONKRETAN ITEM
    // Tražimo govornike čiji se ID nalazi u item.speaker_ids nizu
    const itemSpeakers = speakersData.filter(speaker => 
      item.speaker_ids.includes(speaker.id)
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