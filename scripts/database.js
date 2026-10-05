/**
 * Loads a Pokémon from the API, stores it in POKEMON_DATA and renders its card.
 * @param {number} pokemonId - The id of the Pokémon to load.
 */
async function getData(pokemonId) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        const POKEMON = await RESPONSE.json();
        POKEMON_DATA.push(POKEMON);
        await renderPokecard(POKEMON);
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Loads a single Pokémon from the API without storing or rendering it.
 * @param {number} ID - The id of the Pokémon to load.
 * @returns {Promise<Object|undefined>} The Pokémon data, or undefined if loading failed.
 */
async function getSinglePokemon(ID) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/pokemon/${ID}`);
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        return await RESPONSE.json();
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Loads the symbol icon URL of a Pokémon type from the API.
 * @param {string} typeName - The name of the type.
 * @returns {Promise<string|undefined>} The URL of the icon, or undefined if loading failed.
 */
async function getType(typeName) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        const TYPE_DATA = await RESPONSE.json();
        return TYPE_DATA.sprites['generation-viii']['sword-shield'].symbol_icon;
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Loads the total number of Pokémon species from the API.
 * @returns {Promise<number|undefined>} The number of Pokémon, or undefined if loading failed.
 */
async function getPokemonCount() {
    try {
        const RESPONSE = await fetch('https://pokeapi.co/api/v2/pokemon-species?limit=1');
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        const SPECIES_DATA = await RESPONSE.json();
        return SPECIES_DATA.count;
    } catch (error) {
        console.error(error.message);
    }
}

/**
 * Loads the names of all Pokémon and stores them in ALL_POKEMON_NAMES.
 * @param {number} amount - The number of Pokémon names to load.
 */
async function getAllPokemonNames(amount) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${amount}`);
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        const LIST_DATA = await RESPONSE.json();
        for (let i = 0; i < LIST_DATA.results.length; i++) {
            ALL_POKEMON_NAMES.push(LIST_DATA.results[i].name);
        }
    } catch (error) {
        console.error(error.message);
    }
}