"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Pokemon } from "@/types/pokemon";

interface SearchSuggestionBoxProps {
	pokemons: Pokemon[];
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export default function SearchSuggestionBox({
	pokemons,
	searchQuery,
	onSearchChange,
}: SearchSuggestionBoxProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [highlightIndex, setHighlightIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	const suggestions = searchQuery.trim()
		? pokemons
			.filter(
				(p) =>
					p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					p.number.includes(searchQuery)
			)
			.slice(0, 8)
		: [];

	const showSuggestions = isFocused && suggestions.length > 0;

	const handleSelect = useCallback(
		(name: string) => {
			onSearchChange(name);
			setIsFocused(false);
			inputRef.current?.blur();
		},
		[onSearchChange]
	);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (!showSuggestions) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			setHighlightIndex((prev) =>
				prev < suggestions.length - 1 ? prev + 1 : 0
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setHighlightIndex((prev) =>
				prev > 0 ? prev - 1 : suggestions.length - 1
			);
		} else if (e.key === "Enter" && highlightIndex >= 0) {
			e.preventDefault();
			handleSelect(suggestions[highlightIndex].name);
		} else if (e.key === "Escape") {
			setIsFocused(false);
		}
	};

	// Reset highlight index when suggestions change
	useEffect(() => {
		setHighlightIndex(-1);
	}, [searchQuery]);

	// Scroll highlighted item into view
	useEffect(() => {
		if (highlightIndex >= 0 && listRef.current) {
			const item = listRef.current.children[highlightIndex] as HTMLElement;
			item?.scrollIntoView({ block: "nearest" });
		}
	}, [highlightIndex]);

	return (
		<div className="relative">
			{/* Search Input */}
			<div className="relative">
				<svg
					className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					ref={inputRef}
					type="text"
					placeholder="Search Pokémon by name or number…"
					value={searchQuery}
				onChange={(e) => {
					onSearchChange(e.target.value);
					setIsFocused(true);
				}}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						// Delay to allow click on suggestion
						setTimeout(() => setIsFocused(false), 150);
					}}
					onKeyDown={handleKeyDown}
					className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 shadow-sm outline-none transition-all placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-blue-500 dark:focus:ring-blue-900"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => onSearchChange("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
					>
						<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>

			{/* Suggestions Dropdown */}
			{showSuggestions && (
				<ul
					ref={listRef}
					className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
				>
					{suggestions.map((pokemon, index) => (
						<li
							key={pokemon.id}
							onClick={() => handleSelect(pokemon.name)}
							className={`flex cursor-pointer items-center gap-3 px-4 py-2 text-sm transition-colors ${index === highlightIndex
									? "bg-blue-50 dark:bg-blue-900/30"
									: "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
								}`}
						>
							<Image
								src={pokemon.image}
								alt={pokemon.name}
								width={32}
								height={32}
								className="h-8 w-8 object-contain"
							/>
							<div className="flex flex-col">
								<span className="font-medium text-zinc-800 dark:text-zinc-100">
									{pokemon.name}
								</span>
								<span className="text-xs text-zinc-400">
									#{pokemon.number} · {pokemon.types.join(", ")}
								</span>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
