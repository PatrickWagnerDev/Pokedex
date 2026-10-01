async function getData(P) {
    let apiURL = `https://pokeapi.co/api/v2/pokemon/${P}`
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    await renderPokecard(currentResponse);
}

async function getType(T) {
    let apiURL = `https://pokeapi.co/api/v2/type/${T}`
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    return currentResponse.sprites['generation-viii']['sword-shield'].symbol_icon;
}

async function getImage(I) {
    let apiURL = `https://pokeapi.co/api/v2/pokemon-form/${I}`
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    return currentResponse.sprites['other']['showdown'].front_default;
}