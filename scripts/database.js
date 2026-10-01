async function getData(P) {
    let apiURL = `https://pokeapi.co/api/v2/pokemon/${P}`
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
    renderPokecard(currentResponse);
}