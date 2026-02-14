"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar, { SidebarFilters } from "@/components/Sidebar";
import PokemonCard from "@/components/PokemonCard";
import PokemonDetailModal from "@/components/PokemonDetailModal";
import { Pokemon, EvolutionPokemon } from "@/types/pokemon";
import { usePokemons } from "@/hooks/usePokemon";

// ── Evolution chain helper ──────────────────────────────
function getFullEvolutionChain(
  allPokemons: Pokemon[],
  current: Pokemon
): EvolutionPokemon[] {
  const toEvo = (p: Pokemon | EvolutionPokemon): EvolutionPokemon => ({
    id: p.id,
    number: p.number,
    name: p.name,
    classification: p.classification,
    types: p.types,
    resistant: p.resistant,
    weaknesses: p.weaknesses,
    fleeRate: p.fleeRate,
    maxCP: p.maxCP,
    maxHP: p.maxHP,
    image: p.image,
  });

  const findParent = (name: string): Pokemon | null =>
    allPokemons.find((p) =>
      p.evolutions?.some((e) => e.name.toLowerCase() === name.toLowerCase())
    ) ?? null;

  let root: Pokemon = current;
  let parent = findParent(root.name);
  while (parent) {
    root = parent;
    parent = findParent(root.name);
  }

  const chain: EvolutionPokemon[] = [toEvo(root)];
  if (root.evolutions) {
    chain.push(...root.evolutions.map(toEvo));
  }

  const seen = new Set<string>();
  return chain.filter((evo) => {
    if (seen.has(evo.id)) return false;
    seen.add(evo.id);
    return true;
  });
}

// // ── Props ───────────────────────────────────────────────
// interface HomeClientProps {
//   /** Pre-fetched on the server — no client-side loading needed */
//   pokemons: Pokemon[];
// }

// export default function HomeClient({ pokemons: allPokemons }: HomeClientProps) {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const urlSearch = searchParams.get("search") ?? "";
//   const urlPokemon = searchParams.get("pokemon") ?? "";

//   const [filters, setFilters] = useState<SidebarFilters>({
//     searchQuery: urlSearch,
//     attackQuery: "",
//     selectedTypes: [],
//     selectedWeaknesses: [],
//     selectedResistances: [],
//     maxCP: { min: "", max: "" },
//     maxHP: { min: "", max: "" },
//     weight: { min: "", max: "" },
//     height: { min: "", max: "" },
//   });

//   // ── URL sync ────────────────────────────────────────────
//   const updateURL = useCallback(
//     (search: string, pokemon: string) => {
//       const params = new URLSearchParams();
//       if (search) params.set("search", search);
//       if (pokemon) params.set("pokemon", pokemon);
//       const qs = params.toString();
//       router.replace(qs ? `?${qs}` : "/", { scroll: false });
//     },
//     [router]
//   );

//   const handleFiltersChange = useCallback(
//     (newFilters: SidebarFilters) => {
//       setFilters(newFilters);
//       updateURL(newFilters.searchQuery, urlPokemon);
//     },
//     [updateURL, urlPokemon]
//   );

//   useEffect(() => {
//     setFilters((prev) => {
//       if (prev.searchQuery !== urlSearch) {
//         return { ...prev, searchQuery: urlSearch };
//       }
//       return prev;
//     });
//   }, [urlSearch]);

//   // ── Selected pokemon + evolution chain ──────────────────
//   const selectedPokemon = urlPokemon
//     ? allPokemons.find(
//         (p) => p.name.toLowerCase() === urlPokemon.toLowerCase()
//       ) ?? null
//     : null;

//   const fullEvolutionChain = useMemo(() => {
//     if (!selectedPokemon) return [];
//     return getFullEvolutionChain(allPokemons, selectedPokemon);
//   }, [allPokemons, selectedPokemon]);

//   const handleCardClick = useCallback(
//     (pokemon: Pokemon) => {
//       updateURL(filters.searchQuery, pokemon.name);
//     },
//     [updateURL, filters.searchQuery]
//   );

//   const handleCloseDetail = useCallback(() => {
//     updateURL(filters.searchQuery, "");
//   }, [updateURL, filters.searchQuery]);

//   // ── Filtering ─────────────────────────────────────────
//   const filteredPokemons = useMemo(() => {
//     return allPokemons.filter((p) => {
//       // Search filter (trim whitespace)
//       const trimmedSearch = filters.searchQuery.trim();
//       if (trimmedSearch) {
//         const q = trimmedSearch.toLowerCase();
//         if (
//           !p.name.toLowerCase().includes(q) &&
//           !p.number.includes(trimmedSearch)
//         ) {
//           return false;
//         }
//       }

//       // Attack name filter — guard against null names from GraphQL
//       const trimmedAttack = filters.attackQuery.trim();
//       if (trimmedAttack) {
//         const aq = trimmedAttack.toLowerCase();
//         const allAttacks = [
//           ...(p.attacks?.fast ?? []),
//           ...(p.attacks?.special ?? []),
//         ];
//         if (
//           !allAttacks.some(
//             (a) => a.name && a.name.toLowerCase().includes(aq)
//           )
//         ) {
//           return false;
//         }
//       }

//       // Type filter
//       if (
//         filters.selectedTypes.length > 0 &&
//         !filters.selectedTypes.some((t) => p.types.includes(t))
//       ) {
//         return false;
//       }

//       // Weakness filter
//       if (
//         filters.selectedWeaknesses.length > 0 &&
//         !filters.selectedWeaknesses.some((w) => p.weaknesses.includes(w))
//       ) {
//         return false;
//       }

//       // Resistance filter
//       if (
//         filters.selectedResistances.length > 0 &&
//         !filters.selectedResistances.some((r) => p.resistant.includes(r))
//       ) {
//         return false;
//       }

//       // Max CP range filter
//       if (filters.maxCP.min && p.maxCP < Number(filters.maxCP.min))
//         return false;
//       if (filters.maxCP.max && p.maxCP > Number(filters.maxCP.max))
//         return false;

//       // Max HP range filter
//       if (filters.maxHP.min && p.maxHP < Number(filters.maxHP.min))
//         return false;
//       if (filters.maxHP.max && p.maxHP > Number(filters.maxHP.max))
//         return false;

//       // Weight range filter
//       const weightMax = parseFloat(p.weight.maximum);
//       if (filters.weight.min && weightMax < Number(filters.weight.min))
//         return false;
//       if (filters.weight.max && weightMax > Number(filters.weight.max))
//         return false;

//       // Height range filter
//       const heightMax = parseFloat(p.height.maximum);
//       if (filters.height.min && heightMax < Number(filters.height.min))
//         return false;
//       if (filters.height.max && heightMax > Number(filters.height.max))
//         return false;

//       return true;
//     });
//   }, [allPokemons, filters]);

//   // ── Render ────────────────────────────────────────────
//   return (
//     <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
//       {/* Sidebar */}
//       <Sidebar
//         pokemons={allPokemons}
//         filters={filters}
//         onFiltersChange={handleFiltersChange}
//       />

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto p-6">
//         <div className="mb-4 flex items-center justify-between">
//           <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
//             Pokémon{" "}
//             <span className="text-sm font-normal text-zinc-400">
//               ({filteredPokemons.length} results)
//             </span>
//           </h2>
//         </div>

//         {/* Empty state */}
//         {filteredPokemons.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 text-center">
//             <svg
//               className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <p className="text-lg font-medium text-zinc-400 dark:text-zinc-500">
//               No Pokémon found
//             </p>
//             <p className="mt-1 text-sm text-zinc-400">
//               Try adjusting your filters
//             </p>
//           </div>
//         )}

//         {/* Pokemon grid */}
//         {filteredPokemons.length > 0 && (
//           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {filteredPokemons.map((pokemon) => (
//               <PokemonCard
//                 key={pokemon.id}
//                 pokemon={pokemon}
//                 onClick={handleCardClick}
//               />
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Detail Modal */}
//       {selectedPokemon && (
//         <PokemonDetailModal
//           pokemon={selectedPokemon}
//           allPokemons={allPokemons}
//           evolutionChain={fullEvolutionChain}
//           onClose={handleCloseDetail}
//           onSelectPokemon={(name) => updateURL(filters.searchQuery, name)}
//         />
//       )}
//     </div>
//   );
// }

/*
This is client side implementation
*/

export default function HomeClient() {
  // ── All hooks MUST be called before any early return ────
  const { pokemons: allPokemons, loading, error } = usePokemons(151);
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSearch = searchParams.get("search") ?? "";
  const urlPokemon = searchParams.get("pokemon") ?? "";

  const [filters, setFilters] = useState<SidebarFilters>({
    searchQuery: urlSearch,
    attackQuery: "",
    selectedTypes: [],
    selectedWeaknesses: [],
    selectedResistances: [],
    maxCP: { min: "", max: "" },
    maxHP: { min: "", max: "" },
    weight: { min: "", max: "" },
    height: { min: "", max: "" },
  });

  // ── URL sync ────────────────────────────────────────────
  const updateURL = useCallback(
    (search: string, pokemon: string) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (pokemon) params.set("pokemon", pokemon);
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "/", { scroll: false });
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: SidebarFilters) => {
      setFilters(newFilters);
      updateURL(newFilters.searchQuery, urlPokemon);
    },
    [updateURL, urlPokemon]
  );

  useEffect(() => {
    setFilters((prev) => {
      if (prev.searchQuery !== urlSearch) {
        return { ...prev, searchQuery: urlSearch };
      }
      return prev;
    });
  }, [urlSearch]);

  // ── Selected pokemon + evolution chain ──────────────────
  const selectedPokemon = urlPokemon
    ? allPokemons.find(
        (p) => p.name.toLowerCase() === urlPokemon.toLowerCase()
      ) ?? null
    : null;

  const fullEvolutionChain = useMemo(() => {
    if (!selectedPokemon) return [];
    return getFullEvolutionChain(allPokemons, selectedPokemon);
  }, [allPokemons, selectedPokemon]);

  const handleCardClick = useCallback(
    (pokemon: Pokemon) => {
      updateURL(filters.searchQuery, pokemon.name);
    },
    [updateURL, filters.searchQuery]
  );

  const handleCloseDetail = useCallback(() => {
    updateURL(filters.searchQuery, "");
  }, [updateURL, filters.searchQuery]);

  // ── Filtering ─────────────────────────────────────────
  const filteredPokemons = useMemo(() => {
    return allPokemons.filter((p) => {
      // Search filter (trim whitespace)
      const trimmedSearch = filters.searchQuery.trim();
      if (trimmedSearch) {
        const q = trimmedSearch.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.number.includes(trimmedSearch)
        ) {
          return false;
        }
      }

      // Attack name filter — guard against null names from GraphQL
      const trimmedAttack = filters.attackQuery.trim();
      if (trimmedAttack) {
        const aq = trimmedAttack.toLowerCase();
        const allAttacks = [
          ...(p.attacks?.fast ?? []),
          ...(p.attacks?.special ?? []),
        ];
        if (
          !allAttacks.some(
            (a) => a.name && a.name.toLowerCase().includes(aq)
          )
        ) {
          return false;
        }
      }

      // Type filter
      if (
        filters.selectedTypes.length > 0 &&
        !filters.selectedTypes.some((t) => p.types.includes(t))
      ) {
        return false;
      }

      // Weakness filter
      if (
        filters.selectedWeaknesses.length > 0 &&
        !filters.selectedWeaknesses.some((w) => p.weaknesses.includes(w))
      ) {
        return false;
      }

      // Resistance filter
      if (
        filters.selectedResistances.length > 0 &&
        !filters.selectedResistances.some((r) => p.resistant.includes(r))
      ) {
        return false;
      }

      // Max CP range filter
      if (filters.maxCP.min && p.maxCP < Number(filters.maxCP.min))
        return false;
      if (filters.maxCP.max && p.maxCP > Number(filters.maxCP.max))
        return false;

      // Max HP range filter
      if (filters.maxHP.min && p.maxHP < Number(filters.maxHP.min))
        return false;
      if (filters.maxHP.max && p.maxHP > Number(filters.maxHP.max))
        return false;

      // Weight range filter
      const weightMax = parseFloat(p.weight.maximum);
      if (filters.weight.min && weightMax < Number(filters.weight.min))
        return false;
      if (filters.weight.max && weightMax > Number(filters.weight.max))
        return false;

      // Height range filter
      const heightMax = parseFloat(p.height.maximum);
      if (filters.height.min && heightMax < Number(filters.height.min))
        return false;
      if (filters.height.max && heightMax > Number(filters.height.max))
        return false;

      return true;
    });
  }, [allPokemons, filters]);

  // ── Render ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-red-500" />
          <p className="text-sm">Loading Pokémon…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <Sidebar
        pokemons={allPokemons}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Pokémon{" "}
            <span className="text-sm font-normal text-zinc-400">
              ({filteredPokemons.length} results)
            </span>
          </h2>
        </div>

        {/* Empty state */}
        {filteredPokemons.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg
              className="mb-4 h-16 w-16 text-zinc-300 dark:text-zinc-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-lg font-medium text-zinc-400 dark:text-zinc-500">
              No Pokémon found
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              Try adjusting your filters
            </p>
          </div>
        )}

        {/* Pokemon grid */}
        {filteredPokemons.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPokemons.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          allPokemons={allPokemons}
          evolutionChain={fullEvolutionChain}
          onClose={handleCloseDetail}
          onSelectPokemon={(name) => updateURL(filters.searchQuery, name)}
        />
      )}
    </div>
  );
}
