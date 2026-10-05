async function getData(P) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/pokemon/${P}`);
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

async function getType(T) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/type/${T}`);
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        const TYPE_DATA = await RESPONSE.json();
        return TYPE_DATA.sprites['generation-viii']['sword-shield'].symbol_icon;
    } catch (error) {
        console.error(error.message);
    }
}

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

async function getAllPokemonNames(A) {
    try {
        const RESPONSE = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${A}`);
        if (!RESPONSE.ok) {
            throw new Error(`Error Code: ${RESPONSE.status}`);
        }
        const LIST_DATA = await RESPONSE.json();
        for (let nameIndex = 0; nameIndex < LIST_DATA.results.length; nameIndex++) {
            ALL_POKEMON_NAMES.push(LIST_DATA.results[nameIndex].name);
        }
    } catch (error) {
        console.error(error.message);
    }
}