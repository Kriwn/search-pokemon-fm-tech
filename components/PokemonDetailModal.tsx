"use client";

import Image from "next/image";
import { Pokemon, EvolutionPokemon, TYPE_COLORS, TYPE_BORDER_COLORS } from "@/types/pokemon";

/** Max number of pokemon shown in each Threats / Strong Against row */
const MATCHUP_LIMIT = 5;

/**
 * Threats — pokemon whose weaknesses include at least one of `target`'s types,
 * meaning `target` is *strong against* them?  No — threats are the other way:
 * pokemon that have types in `target`'s weaknesses (same pool as counters) but
 * also *resist* `target`'s attack types — making them extra dangerous.
 *
 * Simplified: pokemon that the selected pokemon is good against — their
 * weaknesses contain at least one of the selected pokemon's types.
 * Label: "Strong Against" / "Threats" depending on perspective.
 *
 * Here: **Threats TO this pokemon** = pokemon that resist this pokemon's types
 * AND whose types are super-effective (in this pokemon's weaknesses).
 */
function getThreats(target: Pokemon, allPokemons: Pokemon[]): Pokemon[] {
	const weakSet = new Set(target.weaknesses.map((w) => w.toLowerCase()));
	const typeSet = new Set(target.types.map((t) => t.toLowerCase()));

	return allPokemons
		.filter((p) => p.id !== target.id)
		.map((p) => {
			// How many of their types are super-effective against target
			const offence = p.types.filter((t) => weakSet.has(t.toLowerCase())).length;
			// How many of target's types do they resist
			const defence = p.resistant.filter((r) => typeSet.has(r.toLowerCase())).length;
			return { pokemon: p, offence, defence, total: offence + defence };
		})
		.filter((x) => x.offence > 0 && x.defence > 0)
		.sort((a, b) => b.total - a.total || b.pokemon.maxCP - a.pokemon.maxCP)
		.slice(0, MATCHUP_LIMIT)
		.map((x) => x.pokemon);
}

/**
 * Strong Against — pokemon whose weaknesses include at least one of
 * the selected pokemon's types (this pokemon deals super-effective damage).
 */
function getStrongAgainst(target: Pokemon, allPokemons: Pokemon[]): Pokemon[] {
	if (!target.types.length) return [];
	const typeSet = new Set(target.types.map((t) => t.toLowerCase()));

	return allPokemons
		.filter((p) => p.id !== target.id)
		.map((p) => ({
			pokemon: p,
			score: p.weaknesses.filter((w) => typeSet.has(w.toLowerCase())).length,
		}))
		.filter((x) => x.score > 0)
		.sort((a, b) => b.score - a.score || b.pokemon.maxCP - a.pokemon.maxCP)
		.slice(0, MATCHUP_LIMIT)
		.map((x) => x.pokemon);
}

interface PokemonDetailModalProps {
	pokemon: Pokemon;
	/** Every pokemon — used to compute counters / threats */
	allPokemons?: Pokemon[];
	/** Full evolution chain (stage 1 → 2 → 3) including the current pokemon */
	evolutionChain?: EvolutionPokemon[];
	onClose: () => void;
	/** Called when the user clicks an evolution — navigates to that pokemon's detail */
	onSelectPokemon?: (name: string) => void;
}

export default function PokemonDetailModal({
	pokemon,
	allPokemons,
	evolutionChain,
	onClose,
	onSelectPokemon,
}: PokemonDetailModalProps) {
	const primaryType = pokemon.types[0] ?? "Normal";
	const borderColor = TYPE_BORDER_COLORS[primaryType] ?? "border-gray-300";

	// Use the full chain if provided, otherwise fall back to forward-only evolutions
	const displayChain: EvolutionPokemon[] = evolutionChain && evolutionChain.length > 0
		? evolutionChain
		: pokemon.evolutions ?? [];

	// Matchup lists
	const threats = allPokemons ? getThreats(pokemon, allPokemons) : [];
	const strongAgainst = allPokemons ? getStrongAgainst(pokemon, allPokemons) : [];

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className={`relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border-2 ${borderColor} bg-white shadow-2xl dark:bg-zinc-900`}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute right-3 top-3 z-10 rounded-full bg-zinc-100 p-1.5 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
				>
					<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>

				{/* Header */}
				<div className="flex flex-col items-center gap-4 px-8 pt-8 sm:flex-row sm:items-start sm:gap-8">
					{/* Image */}
					<div className="flex h-48 w-48 flex-shrink-0 items-center justify-center">
						<Image
							src={pokemon.image}
							alt={pokemon.name}
							width={180}
							height={180}
							className="object-contain drop-shadow-lg"
						/>
					</div>

					{/* Info */}
					<div className="flex flex-col items-center sm:items-start">
						<span className="text-sm font-semibold text-zinc-400">#{pokemon.number}</span>
						<h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">{pokemon.name}</h2>
						<span className="text-sm text-zinc-500 dark:text-zinc-400">{pokemon.classification}</span>

						{/* Types */}
						<div className="mt-2 flex flex-wrap gap-2">
							{pokemon.types.map((type) => (
								<span
									key={type}
									className={`rounded-full px-3 py-0.5 text-xs font-semibold text-white ${TYPE_COLORS[type] ?? "bg-gray-400"}`}
								>
									{type}
								</span>
							))}
						</div>

						{/* Quick Stats */}
						<div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
							<div>
								<span className="text-zinc-400">Max CP: </span>
								<span className="font-bold text-zinc-700 dark:text-zinc-200">{pokemon.maxCP}</span>
							</div>
							<div>
								<span className="text-zinc-400">Max HP: </span>
								<span className="font-bold text-zinc-700 dark:text-zinc-200">{pokemon.maxHP}</span>
							</div>
							<div>
								<span className="text-zinc-400">Weight: </span>
								<span className="text-zinc-600 dark:text-zinc-300">{pokemon.weight.minimum} – {pokemon.weight.maximum}</span>
							</div>
							<div>
								<span className="text-zinc-400">Height: </span>
								<span className="text-zinc-600 dark:text-zinc-300">{pokemon.height.minimum} – {pokemon.height.maximum}</span>
							</div>
							<div>
								<span className="text-zinc-400">Flee Rate: </span>
								<span className="text-zinc-600 dark:text-zinc-300">{(pokemon.fleeRate * 100).toFixed(0)}%</span>
							</div>
						</div>
					</div>
				</div>

				{/* Resistant & Weaknesses */}
				<div className="mt-4 grid grid-cols-2 gap-4 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
					<div>
						<h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">
							Resistant
						</h3>
						<div className="flex flex-wrap gap-1">
							{pokemon.resistant.map((r) => (
								<span
									key={r}
									className={`rounded px-2 py-0.5 text-[11px] font-medium text-white ${TYPE_COLORS[r] ?? "bg-gray-400"}`}
								>
									{r}
								</span>
							))}
						</div>
					</div>
					<div>
						<h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
							Weaknesses
						</h3>
						<div className="flex flex-wrap gap-1">
							{pokemon.weaknesses.map((w) => (
								<span
									key={w}
									className={`rounded px-2 py-0.5 text-[11px] font-medium text-white ${TYPE_COLORS[w] ?? "bg-gray-400"}`}
								>
									{w}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* Attacks */}
				{pokemon.attacks && (
					<div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
						<h3 className="mb-3 text-sm font-bold text-zinc-700 dark:text-zinc-200">Attacks</h3>

						{/* Fast Attacks */}
						{pokemon.attacks.fast && pokemon.attacks.fast.length > 0 && (
							<div className="mb-3">
								<h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
									Fast Attacks
								</h4>
								<div className="flex flex-wrap gap-2">
									{pokemon.attacks.fast.map((attack) => (
										<div
											key={attack.name}
											className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800"
										>
											<span
												className={`inline-block h-2 w-2 rounded-full ${TYPE_COLORS[attack.type] ?? "bg-gray-400"}`}
											/>
											<span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
												{attack.name}
											</span>
											<span className="text-[10px] text-zinc-400">
												{attack.damage} dmg
											</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Special Attacks */}
						{pokemon.attacks.special && pokemon.attacks.special.length > 0 && (
							<div>
								<h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
									Special Attacks
								</h4>
								<div className="flex flex-wrap gap-2">
									{pokemon.attacks.special.map((attack) => (
										<div
											key={attack.name}
											className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 dark:border-amber-800 dark:bg-amber-900/20"
										>
											<span
												className={`inline-block h-2 w-2 rounded-full ${TYPE_COLORS[attack.type] ?? "bg-gray-400"}`}
											/>
											<span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
												{attack.name}
											</span>
											<span className="text-[10px] text-zinc-400">
												{attack.damage} dmg
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}

				{/* Evolution Chain */}
				{displayChain.length > 1 && (
					<div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
						<h3 className="mb-3 text-sm font-bold text-zinc-700 dark:text-zinc-200">Evolution Chain</h3>
						<div className="flex flex-wrap items-center gap-4">
							{displayChain.map((evo, index) => {
								const isCurrent = evo.name.toLowerCase() === pokemon.name.toLowerCase();
								return (
									<div key={evo.id} className="flex items-center gap-3">
										{index > 0 && (
											<svg className="h-5 w-5 text-zinc-300 dark:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										)}
										{isCurrent ? (
											/* Current pokemon — highlighted, not clickable */
											<div className="flex flex-col items-center">
<div className="flex h-20 w-20 items-center justify-center">
											<Image src={evo.image} alt={evo.name} width={64} height={64} className="object-contain drop-shadow-sm" />
												</div>
												<span className="mt-1 text-[10px] text-blue-500 dark:text-blue-400">#{evo.number}</span>
												<span className="text-xs font-bold text-blue-600 dark:text-blue-400">{evo.name}</span>
												<span className="mt-0.5 rounded-full bg-blue-100 px-2 py-px text-[9px] font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">Current</span>
											</div>
										) : (
											/* Other evolution — clickable */
											<button
												type="button"
												className="group flex flex-col items-center transition-transform hover:scale-105"
												onClick={() => onSelectPokemon?.(evo.name)}
												title={`View ${evo.name}`}
											>
<div className="flex h-20 w-20 items-center justify-center">
											<Image src={evo.image} alt={evo.name} width={64} height={64} className="object-contain drop-shadow-sm transition-transform group-hover:scale-110" />
												</div>
												<span className="mt-1 text-[10px] text-zinc-400">#{evo.number}</span>
												<span className="text-xs font-medium text-zinc-700 group-hover:text-blue-500 dark:text-zinc-200 dark:group-hover:text-blue-400">{evo.name}</span>
												<div className="mt-0.5 flex gap-1">
													{evo.types.map((t) => (
														<span
															key={t}
															className={`rounded-full px-1.5 py-px text-[9px] font-semibold text-white ${TYPE_COLORS[t] ?? "bg-gray-400"}`}
														>
															{t}
														</span>
													))}
												</div>
											</button>
										)}
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* ── Matchup sections ───────────────────────────── */}

				{/* Threats — dangerous opponents that resist this pokemon's attacks too */}
				{threats.length > 0 && (
					<MatchupRow
						title="Biggest Threats"
						subtitle="Super-effective & resists this Pokémon's types"
						color="amber"
						pokemons={threats}
						onSelect={onSelectPokemon}
					/>
				)}

				{/* Strong Against — pokemon this one is effective against */}
				{strongAgainst.length > 0 && (
					<MatchupRow
						title="Strong Against"
						subtitle="This Pokémon deals super-effective damage"
						color="green"
						pokemons={strongAgainst}
						onSelect={onSelectPokemon}
					/>
				)}
			</div>
		</div>
	);
}

/* ── Matchup row sub-component ─────────────────────────── */

const COLOR_MAP: Record<string, { heading: string; badge: string }> = {
	red: {
		heading: "text-red-500",
		badge: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
	},
	amber: {
		heading: "text-amber-500 dark:text-amber-400",
		badge: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
	},
	green: {
		heading: "text-green-500 dark:text-green-400",
		badge: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
	},
};

function MatchupRow({
	title,
	subtitle,
	color,
	pokemons,
	onSelect,
}: {
	title: string;
	subtitle: string;
	color: "red" | "amber" | "green";
	pokemons: Pokemon[];
	onSelect?: (name: string) => void;
}) {
	const c = COLOR_MAP[color];

	return (
		<div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
			<h3 className={`mb-0.5 text-sm font-bold ${c.heading}`}>{title}</h3>
			<p className="mb-3 text-[11px] text-zinc-400">{subtitle}</p>
			<div className="flex flex-wrap gap-4">
				{pokemons.map((p) => (
					<button
						key={p.id}
						type="button"
						className="group flex w-20 flex-col items-center transition-transform hover:scale-105"
						onClick={() => onSelect?.(p.name)}
						title={p.name}
					>
						<div className="flex h-20 w-20 items-center justify-center">
							<Image
								src={p.image}
								alt={p.name}
								width={64}
								height={64}
								className="object-contain drop-shadow-sm transition-transform group-hover:scale-110"
							/>
						</div>
						<span className="mt-1 text-[10px] text-zinc-400">#{p.number}</span>
						<span className="line-clamp-1 text-[11px] font-medium text-zinc-700 group-hover:text-blue-500 dark:text-zinc-200">
							{p.name}
						</span>
						<div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
							{p.types.map((t) => (
								<span
									key={t}
									className={`rounded-full px-1 py-px text-[8px] font-semibold text-white ${TYPE_COLORS[t] ?? "bg-gray-400"}`}
								>
									{t}
								</span>
							))}
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
