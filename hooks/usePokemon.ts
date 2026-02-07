"use client";

import { useEffect, useState, useCallback } from "react";
import { Pokemon, EvolutionPokemon, PokemonAttacks } from "@/types/pokemon";
import { pokemonRepo } from "@/repositories/pokemonRepo";

// ── Hook: fetch all pokemons ────────────────────────────
export function usePokemons(first: number = 151) {
	const [pokemons, setPokemons] = useState<Pokemon[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function fetch() {
			try {
				setLoading(true);
				const data = await pokemonRepo.getPokemons(first);
				if (!cancelled) setPokemons(data);
			} catch (err) {
				if (!cancelled) setError(err instanceof Error ? err.message : "Failed to fetch Pokémon");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		fetch();
		return () => { cancelled = true; };
	}, [first]);

	return { pokemons, loading, error };
}

// ── Hook: fetch single pokemon detail (attacks + evolutions) ────
export function usePokemonDetail(name: string | null) {
	const [attacks, setAttacks] = useState<PokemonAttacks | null>(null);
	const [evolutions, setEvolutions] = useState<EvolutionPokemon[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchDetail = useCallback(async (pokemonName: string) => {
		setLoading(true);
		try {
			const [attacksData, evolutionsData] = await Promise.all([
				pokemonRepo.getPokemonAttacks("", pokemonName),
				pokemonRepo.getPokemonEvolutions("", pokemonName),
			]);
			setAttacks(attacksData);
			setEvolutions(evolutionsData);
		} catch {
			setAttacks(null);
			setEvolutions([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (name) {
			fetchDetail(name);
		} else {
			setAttacks(null);
			setEvolutions([]);
		}
	}, [name, fetchDetail]);

	return { attacks, evolutions, loading };
}
