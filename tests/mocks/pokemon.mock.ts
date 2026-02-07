import { Pokemon } from "@/types/pokemon";

export const mockBulbasaur: Pokemon = {
	id: "UG9rZW1vbjowMDE=",
	number: "001",
	name: "Bulbasaur",
	classification: "Seed Pokémon",
	types: ["Grass", "Poison"],
	resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
	weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
	fleeRate: 0.1,
	maxCP: 1071,
	maxHP: 1189,
	weight: { minimum: "6.04kg", maximum: "7.76kg" },
	height: { minimum: "0.61m", maximum: "0.79m" },
	image: "https://img.pokemondb.net/artwork/bulbasaur.jpg",
	attacks: {
		fast: [
			{ name: "Tackle", type: "Normal", damage: 12 },
			{ name: "Vine Whip", type: "Grass", damage: 7 },
		],
		special: [
			{ name: "Power Whip", type: "Grass", damage: 70 },
			{ name: "Seed Bomb", type: "Grass", damage: 40 },
			{ name: "Sludge Bomb", type: "Poison", damage: 55 },
		],
	},
	evolutions: [
		{
			id: "UG9rZW1vbjowMDI=",
			number: "002",
			name: "Ivysaur",
			classification: "Seed Pokémon",
			types: ["Grass", "Poison"],
			resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
			weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
			fleeRate: 0.07,
			maxCP: 1632,
			maxHP: 1812,
			image: "https://img.pokemondb.net/artwork/ivysaur.jpg",
		},
	],
};

export const mockCharmander: Pokemon = {
	id: "UG9rZW1vbjowMDQ=",
	number: "004",
	name: "Charmander",
	classification: "Lizard Pokémon",
	types: ["Fire"],
	resistant: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"],
	weaknesses: ["Water", "Ground", "Rock"],
	fleeRate: 0.1,
	maxCP: 955,
	maxHP: 1085,
	weight: { minimum: "7.44kg", maximum: "9.56kg" },
	height: { minimum: "0.53m", maximum: "0.68m" },
	image: "https://img.pokemondb.net/artwork/charmander.jpg",
	attacks: {
		fast: [
			{ name: "Ember", type: "Fire", damage: 10 },
			{ name: "Scratch", type: "Normal", damage: 6 },
		],
		special: [
			{ name: "Flame Burst", type: "Fire", damage: 30 },
			{ name: "Flame Charge", type: "Fire", damage: 25 },
			{ name: "Flamethrower", type: "Fire", damage: 55 },
		],
	},
	evolutions: [
		{
			id: "UG9rZW1vbjowMDU=",
			number: "005",
			name: "Charmeleon",
			classification: "Flame Pokémon",
			types: ["Fire"],
			resistant: ["Fire", "Grass", "Ice", "Bug", "Steel", "Fairy"],
			weaknesses: ["Water", "Ground", "Rock"],
			fleeRate: 0.07,
			maxCP: 1557,
			maxHP: 1721,
			image: "https://img.pokemondb.net/artwork/charmeleon.jpg",
		},
	],
};

export const mockSquirtle: Pokemon = {
	id: "UG9rZW1vbjowMDc=",
	number: "007",
	name: "Squirtle",
	classification: "Tiny Turtle Pokémon",
	types: ["Water"],
	resistant: ["Fire", "Water", "Ice", "Steel"],
	weaknesses: ["Electric", "Grass"],
	fleeRate: 0.1,
	maxCP: 946,
	maxHP: 1069,
	weight: { minimum: "7.88kg", maximum: "10.13kg" },
	height: { minimum: "0.44m", maximum: "0.56m" },
	image: "https://img.pokemondb.net/artwork/squirtle.jpg",
	attacks: {
		fast: [
			{ name: "Bubble", type: "Water", damage: 25 },
			{ name: "Tackle", type: "Normal", damage: 12 },
		],
		special: [
			{ name: "Aqua Jet", type: "Water", damage: 25 },
			{ name: "Aqua Tail", type: "Water", damage: 45 },
			{ name: "Water Pulse", type: "Water", damage: 35 },
		],
	},
	evolutions: [
		{
			id: "UG9rZW1vbjowMDg=",
			number: "008",
			name: "Wartortle",
			classification: "Turtle Pokémon",
			types: ["Water"],
			resistant: ["Fire", "Water", "Ice", "Steel"],
			weaknesses: ["Electric", "Grass"],
			fleeRate: 0.07,
			maxCP: 1488,
			maxHP: 1649,
			image: "https://img.pokemondb.net/artwork/wartortle.jpg",
		},
	],
};
