"use client";

import Image from "next/image";
import { Pokemon, TYPE_COLORS, TYPE_BORDER_COLORS } from "@/types/pokemon";

interface PokemonCardProps {
	pokemon: Pokemon;
	onClick?: (pokemon: Pokemon) => void;
}

export default function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
	const primaryType = pokemon.types[0] ?? "Normal";
	const borderColor = TYPE_BORDER_COLORS[primaryType] ?? "border-gray-300";

	return (
		<div
			onClick={() => onClick?.(pokemon)}
			className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 ${borderColor} bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900`}
		>
			{/* Header with number */}
			<div className="flex items-center justify-between px-4 pt-3">
				<span className="text-xs font-semibold text-zinc-400">
					#{pokemon.number}
				</span>
				<span className="text-[10px] font-medium text-zinc-400">
					{pokemon.classification}
				</span>
			</div>

			{/* Image */}
			<div className="relative mx-auto my-2 flex h-36 w-36 items-center justify-center">
				<Image
					src={pokemon.image}
					alt={pokemon.name}
					width={120}
					height={120}
					className="object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
				/>
			</div>

			{/* Name */}
			<h3 className="px-4 text-center text-lg font-bold text-zinc-800 dark:text-zinc-100">
				{pokemon.name}
			</h3>

			{/* Types */}
			<div className="mt-1 flex items-center justify-center gap-2 px-4">
				{pokemon.types.map((type) => (
					<span
						key={type}
						className={`rounded-full px-3 py-0.5 text-xs font-semibold text-white ${TYPE_COLORS[type] ?? "bg-gray-400"}`}
					>
						{type}
					</span>
				))}
			</div>

			{/* Stats */}
			<div className="mt-3 grid grid-cols-2 gap-2 border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
				{/* Max CP */}
				<div className="flex flex-col items-center">
					<span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
						Max CP
					</span>
					<span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
						{pokemon.maxCP}
					</span>
				</div>
				{/* Max HP */}
				<div className="flex flex-col items-center">
					<span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
						Max HP
					</span>
					<span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
						{pokemon.maxHP}
					</span>
				</div>
				{/* Weight */}
				<div className="flex flex-col items-center">
					<span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
						Weight
					</span>
					<span className="text-xs text-zinc-500 dark:text-zinc-400">
						{pokemon.weight.minimum} – {pokemon.weight.maximum}
					</span>
				</div>
				{/* Height */}
				<div className="flex flex-col items-center">
					<span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
						Height
					</span>
					<span className="text-xs text-zinc-500 dark:text-zinc-400">
						{pokemon.height.minimum} – {pokemon.height.maximum}
					</span>
				</div>
			</div>

			{/* Flee Rate bar */}
			<div className="px-4 pb-3">
				<div className="flex items-center justify-between">
					<span className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
						Flee Rate
					</span>
					<span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
						{(pokemon.fleeRate * 100).toFixed(0)}%
					</span>
				</div>
				<div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
					<div
						className={`h-full rounded-full ${TYPE_COLORS[primaryType] ?? "bg-gray-400"}`}
						style={{ width: `${pokemon.fleeRate * 100}%` }}
					/>
				</div>
			</div>

			{/* Resistances & Weaknesses (hover detail) */}
			<div className="border-t border-zinc-100 px-4 py-2 dark:border-zinc-800">
				<div className="mb-1">
					<span className="text-[10px] font-medium uppercase tracking-wider text-green-600 dark:text-green-400">
						Resistant
					</span>
					<div className="mt-0.5 flex flex-wrap gap-1">
						{pokemon.resistant.map((r) => (
							<span
								key={r}
								className={`rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${TYPE_COLORS[r] ?? "bg-gray-400"}`}
							>
								{r}
							</span>
						))}
					</div>
				</div>
				<div>
					<span className="text-[10px] font-medium uppercase tracking-wider text-red-500 dark:text-red-400">
						Weak
					</span>
					<div className="mt-0.5 flex flex-wrap gap-1">
						{pokemon.weaknesses.map((w) => (
							<span
								key={w}
								className={`rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${TYPE_COLORS[w] ?? "bg-gray-400"}`}
							>
								{w}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
