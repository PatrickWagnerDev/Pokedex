let apiURL = "https://pokeapi.co/api/v2/pokemon"

async function getData() {
    let response = await fetch(apiURL);
    let currentResponse = await response.json();
}