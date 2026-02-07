import { gql } from "@apollo/client";

// ── Reusable evolution fields (nested 3 levels deep) ────
const EVOLUTION_FIELDS = `
	id
	number
	name
	classification
	types
	resistant
	weaknesses
	fleeRate
	maxCP
	maxHP
	image
`;

// ── Get all pokemons with attacks & evolutions in one query ──
export const GET_POKEMONS = gql`
	query pokemons($first: Int!) {
		pokemons(first: $first) {
			id
			number
			name
			weight {
				minimum
				maximum
			}
			height {
				minimum
				maximum
			}
			classification
			types
			resistant
			weaknesses
			fleeRate
			maxCP
			maxHP
			image
			attacks {
				fast {
					name
					type
					damage
				}
				special {
					name
					type
					damage
				}
			}
			evolutions {
				${EVOLUTION_FIELDS}
				evolutions {
					${EVOLUTION_FIELDS}
					evolutions {
						${EVOLUTION_FIELDS}
					}
				}
			}
		}
	}
`;

// ── Get single pokemon detail ───────────────────────────
export const GET_POKEMON = gql`
	query pokemon($id: String, $name: String) {
		pokemon(id: $id, name: $name) {
			id
			number
			name
			weight {
				minimum
				maximum
			}
			height {
				minimum
				maximum
			}
			classification
			types
			resistant
			weaknesses
			fleeRate
			maxCP
			maxHP
			image
		}
	}
`;

// ── Get pokemon attacks ─────────────────────────────────
export const GET_POKEMON_ATTACKS = gql`
	query pokemonAttacks($id: String, $name: String) {
		pokemon(id: $id, name: $name) {
			id
			name
			attacks {
				fast {
					name
					type
					damage
				}
				special {
					name
					type
					damage
				}
			}
		}
	}
`;

// ── Get pokemon evolutions (nested) ─────────────────────
export const GET_POKEMON_EVOLUTIONS = gql`
	query pokemonEvolutions($id: String, $name: String) {
		pokemon(id: $id, name: $name) {
			id
			name
			evolutions {
				id
				number
				name
				classification
				types
				resistant
				weaknesses
				fleeRate
				maxCP
				maxHP
				image
				evolutions {
					id
					number
					name
					classification
					types
					resistant
					weaknesses
					fleeRate
					maxCP
					maxHP
					image
					evolutions {
						id
						number
						name
						classification
						types
						resistant
						weaknesses
						fleeRate
						maxCP
						maxHP
						image
					}
				}
			}
		}
	}
`;
