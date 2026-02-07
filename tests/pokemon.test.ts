import { mockBulbasaur, mockCharmander, mockSquirtle } from "./mocks/pokemon.mock";

describe("Pokemon Types", () => {
	it("Bulbasaur should have type Grass", () => {
		expect(mockBulbasaur.types).toContain("Grass");
	});

	it("Charmander should have type Fire", () => {
		expect(mockCharmander.types).toContain("Fire");
	});

	it("Squirtle should have type Water", () => {
		expect(mockSquirtle.types).toContain("Water");
	});
});
