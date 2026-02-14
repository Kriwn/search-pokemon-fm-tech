import { Suspense } from "react";
import { fetchPokemons } from "@/repositories/fetchPokemons";
import HomeClient from "@/components/HomeClient";

// export default async function Page() {
//   const pokemons = await fetchPokemons(151);
//   return (
//     <Suspense
//       fallback={
//         <div className="flex h-screen items-center justify-center text-zinc-400">
//           <div className="flex flex-col items-center gap-3">
//             <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-red-500" />
//             <p className="text-sm">Loading Pokémon…</p>
//           </div>
//         </div>
//       }
//     >
//       <HomeClient pokemons={pokemons} />
//     </Suspense>
//   );
// }


export default function Page() {
  return (
    <Suspense fallback={<div>Loading…</div>}>
      <HomeClient />
    </Suspense>
  );
}
