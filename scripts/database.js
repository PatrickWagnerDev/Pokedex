async function getData(P) {
    let apiURL = `https://pokeapi.co/api/v2/pokemon/${P}`;
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    POKEMON_DATA.push(currentResponse);
    await renderPokecard(currentResponse);
}

async function getType(T) {
    let apiURL = `https://pokeapi.co/api/v2/type/${T}`;
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    return currentResponse.sprites['generation-viii']['sword-shield'].symbol_icon;
}

async function getPokemonCount() {
    let apiURL = `https://pokeapi.co/api/v2/pokemon-species?limit=1`;
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    return currentResponse.count;
}