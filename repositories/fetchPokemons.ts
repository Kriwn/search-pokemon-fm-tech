import { Pokemon, EvolutionPokemon, PokemonAttacks } from "@/types/pokemon";

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

interface RawPokemon {
	id: string;
	number: string;
	name: string;
	weight: { minimum: string; maximum: string };
	height: { minimum: string; maximum: string };
	classification: string;
	types: string[];
	resistant: string[];
	weaknesses: string[];
	fleeRate: number;
	maxCP: number;
	maxHP: number;
	image: string;
	attacks?: {
		fast: Array<{ name: string | null; type: string | null; damage: number }>;
		special: Array<{ name: string | null; type: string | null; damage: number }>;
	};
	evolutions?: RawEvolution[] | null;
}

/**
 * Flatten nested evolutions into a single flat array.
 */
function flattenEvolutions(evolutions: RawEvolution[] | null | undefined): EvolutionPokemon[] {
	if (!evolutions || evolutions.length === 0) return [];

	const result: EvolutionPokemon[] = [];
	for (const evo of evolutions) {
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
		if (evo.evolutions && evo.evolutions.length > 0) {
			result.push(...flattenEvolutions(evo.evolutions));
		}
	}
	return result;
}

/**
 * Clean raw attacks — filter out entries with null names from the API
 */
function cleanAttacks(raw: RawPokemon["attacks"]): PokemonAttacks | undefined {
	if (!raw) return undefined;
	return {
		fast: (raw.fast ?? []).filter((a): a is { name: string; type: string; damage: number } =>
			a.name != null && a.type != null
		),
		special: (raw.special ?? []).filter((a): a is { name: string; type: string; damage: number } =>
			a.name != null && a.type != null
		),
	};
}

// ── GraphQL query (plain string, no gql tag needed for fetch) ──
const POKEMONS_QUERY = `
	query pokemons($first: Int!) {
		pokemons(first: $first) {
			id
			number
			name
			weight { minimum maximum }
			height { minimum maximum }
			classification
			types
			resistant
			weaknesses
			fleeRate
			maxCP
			maxHP
			image
			attacks {
				fast { name type damage }
				special { name type damage }
			}
			evolutions {
				id number name classification types resistant weaknesses fleeRate maxCP maxHP image
				evolutions {
					id number name classification types resistant weaknesses fleeRate maxCP maxHP image
					evolutions {
						id number name classification types resistant weaknesses fleeRate maxCP maxHP image
					}
				}
			}
		}
	}
`;

/**
 * Server-side data fetcher — called in a Server Component.
 * Uses the private BACKEND_POINT env var (not exposed to the browser).
 * The result is cached by Next.js `fetch` with `force-cache` by default.
 */
export async function fetchPokemons(first: number = 151): Promise<Pokemon[]> {
	const endpoint = process.env.BACKEND_POINT || process.env.NEXT_PUBLIC_BACKEND_POINT;
	if (!endpoint) {
		throw new Error("Missing BACKEND_POINT environment variable");
	}

	const res = await fetch(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query: POKEMONS_QUERY, variables: { first } }),
		next: { revalidate: 3600 }, // revalidate every hour
	});

	if (!res.ok) {
		throw new Error(`GraphQL fetch failed: ${res.status} ${res.statusText}`);
	}

	const json = await res.json();
	const rawPokemons: RawPokemon[] = json?.data?.pokemons ?? [];

	return rawPokemons.map((raw) => ({
		id: raw.id,
		number: raw.number,
		name: raw.name,
		weight: raw.weight,
		height: raw.height,
		classification: raw.classification,
		types: raw.types,
		resistant: raw.resistant,
		weaknesses: raw.weaknesses,
		fleeRate: raw.fleeRate,
		maxCP: raw.maxCP,
		maxHP: raw.maxHP,
		image: raw.image,
		attacks: cleanAttacks(raw.attacks),
		evolutions: flattenEvolutions(raw.evolutions),
	}));
}
