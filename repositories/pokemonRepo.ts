import apolloClient from "@/lib/apolloClient";
import {
	GET_POKEMONS,
	GET_POKEMON,
	GET_POKEMON_ATTACKS,
	GET_POKEMON_EVOLUTIONS,
} from "@/grapql/grapqlPokemon";
import { Pokemon, PokemonAttacks, EvolutionPokemon } from "@/types/pokemon";

// ── Raw evolution shape from GraphQL (nested) ───────────
interface RawEvolution {
	id: string;
	number: string;
	name: string;
	classification: string;
	types: string[];
	resistant: string[];
	weaknesses: string[];
	fleeRate: number;
	maxCP: number;
	maxHP: number;
	image: string;
	evolutions?: RawEvolution[] | null;
}

/**
 * Flatten nested evolutions into a single flat array.
 * e.g. Bulbasaur → [Ivysaur] where Ivysaur → [Venusaur]
 * becomes [Ivysaur, Venusaur]
 *
 * The GraphQL API returns evolutions as:
 *   1 → { evolutions: [2 → { evolutions: [3 → { evolutions: null }] }] }
 * We want a flat chain: [2, 3]
 */
function flattenEvolutions(evolutions: RawEvolution[] | null | undefined): EvolutionPokemon[] {
	if (!evolutions || evolutions.length === 0) return [];

	const result: EvolutionPokemon[] = [];

	for (const evo of evolutions) {
		// Push the current evolution (without the nested evolutions key)
		result.push({
			id: evo.id,
			number: evo.number,
			name: evo.name,
			classification: evo.classification,
			types: evo.types,
			resistant: evo.resistant,
			weaknesses: evo.weaknesses,
			fleeRate: evo.fleeRate,
			maxCP: evo.maxCP,
			maxHP: evo.maxHP,
			image: evo.image,
		});

		// Recursively flatten children
		if (evo.evolutions && evo.evolutions.length > 0) {
			result.push(...(evo.evolutions));
		}
	}
	return result;
}

// ── Raw pokemon shape from GraphQL (with nested evolutions) ──
interface RawPokemon extends Omit<Pokemon, 'evolutions'> {
	evolutions?: RawEvolution[] | null;
}

// ── Repository interface ────────────────────────────────
export interface PokemonRepository {
	/** Fetch all pokemons with attacks & evolutions in a single query.
	 *  Cached after the first call — subsequent calls return instantly. */
	getPokemons(first: number): Promise<Pokemon[]>;
	getPokemonByName(name: string): Promise<Pokemon | null>;
	getPokemonAttacks(id: string, name: string): Promise<PokemonAttacks | null>;
	getPokemonEvolutions(id: string, name: string): Promise<EvolutionPokemon[]>;
}

// ── GraphQL implementation with in-memory cache ─────────
export function createPokemonRepository(): PokemonRepository {
	// Cache the full list — fetched once, used forever within the browser tab
	let pokemonsCache: Pokemon[] | null = null;
	let pokemonsCacheInflight: Promise<Pokemon[]> | null = null;

	return {
		async getPokemons(first: number): Promise<Pokemon[]> {
			// 1. Already cached — return instantly
			if (pokemonsCache !== null) return pokemonsCache;

			// 2. Already in-flight — deduplicate (e.g. React StrictMode double-fire)
			if (pokemonsCacheInflight !== null) return pokemonsCacheInflight;

			// 3. First request — fetch & cache
			pokemonsCacheInflight = (async () => {
				const { data } = await apolloClient.query<{ pokemons: RawPokemon[] }>({
					query: GET_POKEMONS,
					variables: { first },
				});

				// Flatten nested evolutions for every pokemon
				const pokemons: Pokemon[] = (data?.pokemons ?? []).map((raw) => ({
					...raw,
					evolutions: flattenEvolutions(raw.evolutions),
				}));

				pokemonsCache = pokemons;
				pokemonsCacheInflight = null;
				return pokemons;
			})();

			return pokemonsCacheInflight;
		},

		async getPokemonByName(name: string): Promise<Pokemon | null> {
			// Try cache first
			if (pokemonsCache) {
				return pokemonsCache.find((p) => p.name.toLowerCase() === name.toLowerCase()) ?? null;
			}
			const { data } = await apolloClient.query<{ pokemon: Pokemon | null }>({
				query: GET_POKEMON,
				variables: { name },
			});
			return data?.pokemon ?? null;
		},

		async getPokemonAttacks(id: string, name: string): Promise<PokemonAttacks | null> {
			// Try cache first
			if (pokemonsCache) {
				const found = pokemonsCache.find((p) => p.name.toLowerCase() === name.toLowerCase());
				if (found?.attacks) return found.attacks;
			}
			const { data } = await apolloClient.query<{ pokemon: { attacks: PokemonAttacks } | null }>({
				query: GET_POKEMON_ATTACKS,
				variables: { id: id || undefined, name: name || undefined },
			});
			return data?.pokemon?.attacks ?? null;
		},

		async getPokemonEvolutions(id: string, name: string): Promise<EvolutionPokemon[]> {
			// Try cache first
			if (pokemonsCache) {
				const found = pokemonsCache.find((p) => p.name.toLowerCase() === name.toLowerCase());
				if (found?.evolutions) return found.evolutions;
			}
			const { data } = await apolloClient.query<{ pokemon: { evolutions: RawEvolution[] | null } | null }>({
				query: GET_POKEMON_EVOLUTIONS,
				variables: { id: id || undefined, name: name || undefined },
			});
			const rawEvolutions: RawEvolution[] | null = data?.pokemon?.evolutions ?? null;
			return flattenEvolutions(rawEvolutions);
		},
	};
}

// Singleton instance
export const pokemonRepo = createPokemonRepository();
