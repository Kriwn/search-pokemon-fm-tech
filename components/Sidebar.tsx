"use client";

import { Pokemon, POKEMON_TYPES, TYPE_COLORS } from "@/types/pokemon";
import SearchSuggestionBox from "./SearchSuggestionBox";

export interface RangeFilter {
	min: string;
	max: string;
}

export interface SidebarFilters {
	searchQuery: string;
	attackQuery: string;
	selectedTypes: string[];
	selectedWeaknesses: string[];
	selectedResistances: string[];
	maxCP: RangeFilter;
	maxHP: RangeFilter;
	weight: RangeFilter;
	height: RangeFilter;
}

interface SidebarProps {
	pokemons: Pokemon[];
	filters: SidebarFilters;
	onFiltersChange: (filters: SidebarFilters) => void;
}

export default function Sidebar({
	pokemons,
	filters,
	onFiltersChange,
}: SidebarProps) {
	const toggleFilter = (
		key: "selectedTypes" | "selectedWeaknesses" | "selectedResistances",
		value: string
	) => {
		const current = filters[key];
		const updated = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];
		onFiltersChange({ ...filters, [key]: updated });
	};

	const clearAll = () => {
		onFiltersChange({
			searchQuery: "",
			attackQuery: "",
			selectedTypes: [],
			selectedWeaknesses: [],
			selectedResistances: [],
			maxCP: { min: "", max: "" },
			maxHP: { min: "", max: "" },
			weight: { min: "", max: "" },
			height: { min: "", max: "" },
		});
	};

	const hasActiveFilters =
		filters.searchQuery ||
		filters.attackQuery ||
		filters.selectedTypes.length > 0 ||
		filters.selectedWeaknesses.length > 0 ||
		filters.selectedResistances.length > 0 ||
		filters.maxCP.min || filters.maxCP.max ||
		filters.maxHP.min || filters.maxHP.max ||
		filters.weight.min || filters.weight.max ||
		filters.height.min || filters.height.max;

	return (
		<aside className="flex h-full w-72 flex-col gap-5 overflow-y-auto border-r border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
			{/* Logo / Title */}
			<div className="flex items-center gap-2">
				<svg className="h-6 w-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
					<circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="none" />
					<line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
					<circle cx="12" cy="12" r="4" fill="currentColor" />
					<circle cx="12" cy="12" r="2" className="fill-white dark:fill-zinc-900" />
				</svg>
				<h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
					Pokédex
				</h1>
			</div>

			{/* Search */}
			<SearchSuggestionBox
				pokemons={pokemons}
				searchQuery={filters.searchQuery}
				onSearchChange={(query) =>
					onFiltersChange({ ...filters, searchQuery: query })
				}
			/>

			{/* Clear filters */}
			{hasActiveFilters && (
				<button
					onClick={clearAll}
					className="flex items-center gap-1.5 self-start rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
				>
					<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
					Clear all filters
				</button>
			)}

			{/* Type Filter */}
			<FilterSection
				title="Type"
				items={POKEMON_TYPES as unknown as string[]}
				selected={filters.selectedTypes}
				onToggle={(value) => toggleFilter("selectedTypes", value)}
			/>

			{/* Weakness Filter */}
			<FilterSection
				title="Weakness"
				items={POKEMON_TYPES as unknown as string[]}
				selected={filters.selectedWeaknesses}
				onToggle={(value) => toggleFilter("selectedWeaknesses", value)}
			/>

			{/* Resistance Filter */}
			<FilterSection
				title="Resistant"
				items={POKEMON_TYPES as unknown as string[]}
				selected={filters.selectedResistances}
				onToggle={(value) => toggleFilter("selectedResistances", value)}
			/>

			{/* Attack Search */}
			<div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
				<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
					Search by Attack
				</h2>
				<div className="relative">
					<svg
						className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
					<input
						type="text"
						placeholder="e.g. Vine Whip, Thunder…"
						value={filters.attackQuery}
						onChange={(e) =>
							onFiltersChange({ ...filters, attackQuery: e.target.value })
						}
						className="w-full rounded-lg border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-700 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
					/>
					{filters.attackQuery && (
						<button
							type="button"
							onClick={() => onFiltersChange({ ...filters, attackQuery: "" })}
							className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
						>
							<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)}
				</div>
			</div>

			{/* Stat Range Filters */}
			<div className="border-t border-zinc-200 pt-4 dark:border-zinc-700">
				<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
					Stat Ranges
				</h2>
				<div className="flex flex-col gap-3">
					<RangeInput
						label="Max CP"
						value={filters.maxCP}
						onChange={(val) => onFiltersChange({ ...filters, maxCP: val })}
						placeholderMin="0"
						placeholderMax="4000"
					/>
					<RangeInput
						label="Max HP"
						value={filters.maxHP}
						onChange={(val) => onFiltersChange({ ...filters, maxHP: val })}
						placeholderMin="0"
						placeholderMax="5000"
					/>
					<RangeInput
						label="Weight (kg)"
						value={filters.weight}
						onChange={(val) => onFiltersChange({ ...filters, weight: val })}
						placeholderMin="0"
						placeholderMax="1000"
					/>
					<RangeInput
						label="Height (m)"
						value={filters.height}
						onChange={(val) => onFiltersChange({ ...filters, height: val })}
						placeholderMin="0"
						placeholderMax="15"
					/>
				</div>
			</div>
		</aside>
	);
}

/* ─── Filter Section ──────────────────────────────────── */

interface FilterSectionProps {
	title: string;
	items: string[];
	selected: string[];
	onToggle: (value: string) => void;
}

function FilterSection({ title, items, selected, onToggle }: FilterSectionProps) {
	return (
		<div>
			<h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
				{title}
			</h2>
			<div className="flex flex-wrap gap-1.5">
				{items.map((item) => {
					const isActive = selected.includes(item);
					const bgColor = TYPE_COLORS[item] ?? "bg-gray-400";

					return (
						<button
							key={item}
							onClick={() => onToggle(item)}
							className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${isActive
									? `${bgColor} text-white shadow-sm`
									: "bg-zinc-200/60 text-zinc-600 hover:bg-zinc-300/80 dark:bg-zinc-700/50 dark:text-zinc-300 dark:hover:bg-zinc-700"
								}`}
						>
							{item}
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ─── Range Input ─────────────────────────────────────── */

interface RangeInputProps {
	label: string;
	value: RangeFilter;
	onChange: (value: RangeFilter) => void;
	placeholderMin?: string;
	placeholderMax?: string;
}

function RangeInput({ label, value, onChange, placeholderMin = "Min", placeholderMax = "Max" }: RangeInputProps) {
	return (
		<div>
			<label className="mb-1 block text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
				{label}
			</label>
			<div className="flex items-center gap-2">
				<input
					type="number"
					value={value.min}
					onChange={(e) => onChange({ ...value, min: e.target.value })}
					placeholder={placeholderMin}
					className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				/>
				<span className="text-xs text-zinc-400">–</span>
				<input
					type="number"
					value={value.max}
					onChange={(e) => onChange({ ...value, max: e.target.value })}
					placeholder={placeholderMax}
					className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-700 outline-none transition-colors placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
				/>
			</div>
		</div>
	);
}
