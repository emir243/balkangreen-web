import Image from "next/image";
// Proveri putanje do komponenti. Ako su u folderu 'components' unutar 'app':


export default function Home() {
  return (
    // 'flex-col' postavlja elemente jedan ispod drugog
    // 'min-h-screen' osigurava da stranica zauzme bar celu visinu ekrana
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      
      

      {/* 2. Glavni sadržaj u sredini */}
      {/* 'flex-grow' gura footer na dno ako nema puno sadržaja */}
      <main className="flex flex-grow flex-col items-center justify-center p-4 text-center">
        
        <h1 className="text-4xl font-bold tracking-tight text-green-600 sm:text-6xl">
          Balkan Green Summit
        </h1>
        
        {/* Ovde kasnije možeš dodati podnaslov ili dugme */}
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Dobrodošli na zvaničnu prezentaciju.
        </p>

      </main>

     
      
    </div>
  );
}