export interface Attack {
	name: string;
	type: string;
	damage: number;
}

export interface PokemonAttacks {
	fast: Attack[];
	special: Attack[];
}

export interface EvolutionPokemon {
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
}

export interface Pokemon {
	id: string;
	number: string;
	name: string;
	weight: {
		minimum: string;
		maximum: string;
	};
	height: {
		minimum: string;
		maximum: string;
	};
	classification: string;
	types: string[];
	resistant: string[];
	weaknesses: string[];
	fleeRate: number;
	maxCP: number;
	maxHP: number;
	image: string;
	attacks?: PokemonAttacks;
	evolutions?: EvolutionPokemon[];
}

export const POKEMON_TYPES = [
	"Normal",
	"Fire",
	"Water",
	"Electric",
	"Grass",
	"Ice",
	"Fighting",
	"Poison",
	"Ground",
	"Flying",
	"Psychic",
	"Bug",
	"Rock",
	"Ghost",
	"Dragon",
	"Dark",
	"Steel",
	"Fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const TYPE_COLORS: Record<string, string> = {
	Normal: "bg-gray-400",
	Fire: "bg-red-500",
	Water: "bg-blue-500",
	Electric: "bg-yellow-400",
	Grass: "bg-green-500",
	Ice: "bg-cyan-300",
	Fighting: "bg-orange-700",
	Poison: "bg-purple-500",
	Ground: "bg-amber-600",
	Flying: "bg-indigo-300",
	Psychic: "bg-pink-500",
	Bug: "bg-lime-500",
	Rock: "bg-stone-500",
	Ghost: "bg-violet-700",
	Dragon: "bg-indigo-600",
	Dark: "bg-gray-700",
	Steel: "bg-slate-400",
	Fairy: "bg-pink-300",
};

export const TYPE_TEXT_COLORS: Record<string, string> = {
	Normal: "text-gray-400",
	Fire: "text-red-500",
	Water: "text-blue-500",
	Electric: "text-yellow-400",
	Grass: "text-green-500",
	Ice: "text-cyan-300",
	Fighting: "text-orange-700",
	Poison: "text-purple-500",
	Ground: "text-amber-600",
	Flying: "text-indigo-300",
	Psychic: "text-pink-500",
	Bug: "text-lime-500",
	Rock: "text-stone-500",
	Ghost: "text-violet-700",
	Dragon: "text-indigo-600",
	Dark: "text-gray-700",
	Steel: "text-slate-400",
	Fairy: "text-pink-300",
};

export const TYPE_BORDER_COLORS: Record<string, string> = {
	Normal: "border-gray-400",
	Fire: "border-red-500",
	Water: "border-blue-500",
	Electric: "border-yellow-400",
	Grass: "border-green-500",
	Ice: "border-cyan-300",
	Fighting: "border-orange-700",
	Poison: "border-purple-500",
	Ground: "border-amber-600",
	Flying: "border-indigo-300",
	Psychic: "border-pink-500",
	Bug: "border-lime-500",
	Rock: "border-stone-500",
	Ghost: "border-violet-700",
	Dragon: "border-indigo-600",
	Dark: "border-gray-700",
	Steel: "border-slate-400",
	Fairy: "border-pink-300",
};
