let loadedPokemon = 0;
const LOAD_AMOUNT = 40;

function init() {
    loadPokemon();
}

async function loadPokemon() {
    const LOAD_MORE_BUTTON = document.getElementById('load-more-button');
    LOAD_MORE_BUTTON.classList.add('d-none');

    const START_ID = loadedPokemon + 1;
    const END_ID = loadedPokemon + LOAD_AMOUNT;
    for (let pokemonId = START_ID; pokemonId <= END_ID; pokemonId++) {
        await getData(pokemonId);
    }
    loadedPokemon = END_ID;

    LOAD_MORE_BUTTON.classList.remove('d-none');
}

async function renderPokecard(p) {
    const POKEMON_LIST = document.getElementById('pokemon-list');
    const TYPE_ICONS = await renderTypeIcons(p.types);
    POKEMON_LIST.insertAdjacentHTML('beforeend', templatePokecard(p, TYPE_ICONS));
}

async function renderTypeIcons(types) {
    let typeHTML = "";
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
        const TYPE_NAME = types[typeIndex].type.name;
        const TYPE_ICON = await getType(TYPE_NAME);
        typeHTML += templateTypeIcon(TYPE_ICON, TYPE_NAME);
    }
    return typeHTML;
}

function capitalizeName(i) {
    return i.charAt(0).toUpperCase() + i.slice(1);
}