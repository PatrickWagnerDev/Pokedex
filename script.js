let loadedPokemon = 0;
let currentPokemonId = 0;
let totalPokemon = 0;
let isLoading = false;
const LOAD_AMOUNT = 40;
const POKEMON_DATA = [];
const MAX_STAT_VALUE = 255;
const STAT_LABELS = ['HP', 'ATK', 'DEF', 'SpATK', 'SpDEF', 'SPE'];
const DIALOG_ANIMATION_DURATION = 300;
const ALL_POKEMON_NAMES = [];
const TYPE_ICON_CACHE = {};

async function init() {
    totalPokemon = await getPokemonCount();
    getAllPokemonNames(totalPokemon);
    loadPokemon();
}

async function loadPokemon() {
    const LOAD_MORE_BUTTON = document.getElementById('load-more-button');
    LOAD_MORE_BUTTON.classList.add('d-none');
    showLoadingScreen();
    try {
        await loadNextPokemon();
    } catch (error) {
        console.error('Fehler beim Laden der Pokemon:', error);
    }
    hideLoadingScreen();
    if (loadedPokemon < totalPokemon) {
        LOAD_MORE_BUTTON.classList.remove('d-none');
    }
}

async function loadNextPokemon() {
    const START_ID = loadedPokemon + 1;
    const END_ID = Math.min(loadedPokemon + LOAD_AMOUNT, totalPokemon);
    for (let pokemonId = START_ID; pokemonId <= END_ID; pokemonId++) {
        await getData(pokemonId);
    }
    loadedPokemon = END_ID;
}

async function renderPokecard(pokemon) {
    const POKEMON_LIST = document.getElementById('pokemon-list');
    const TYPE_ICONS = await renderTypeIcons(pokemon.types);
    const CARD_COLORS = getCardColors(pokemon.types);
    POKEMON_LIST.insertAdjacentHTML('beforeend', templatePokecard(pokemon, TYPE_ICONS, CARD_COLORS));
}

async function renderTypeIcons(types) {
    let typeHTML = "";
    for (let i = 0; i < types.length; i++) {
        const TYPE_NAME = types[i].type.name;
        const TYPE_ICON = await getTypeIcon(TYPE_NAME);
        typeHTML += templateTypeIcon(TYPE_ICON, TYPE_NAME);
    }
    return typeHTML;
}

async function getTypeIcon(typeName) {
    if (!TYPE_ICON_CACHE[typeName]) {
        TYPE_ICON_CACHE[typeName] = await getType(typeName);
    }
    return TYPE_ICON_CACHE[typeName];
}

function getCardColors(types) {
    const FIRST_TYPE = types[0].type.name;
    let secondType = FIRST_TYPE;
    if (types.length > 1) {
        secondType = types[1].type.name;
    }
    return /*html*/`
        --first-type-color: var(--type-${FIRST_TYPE});
        --second-type-color: var(--type-${secondType});
        `;
}

function showPokemonDetails(ID) {
    const POKEDATA_HTML = buildPokedataHTML(POKEMON_DATA[ID - 1]);
    document.getElementById('pokedata').innerHTML = POKEDATA_HTML;
    document.getElementById('pokedata-dialog-content').innerHTML = POKEDATA_HTML;
    currentPokemonId = ID;
    updateNavigationButtons();
    openPokedataDialog();
}

function buildPokedataHTML(pokemon) {
    const POKEDATA_IMAGE = getPokedataImage(pokemon);
    const POKEDATA_TYPES = renderPokedataTypes(pokemon.types);
    const BACKGROUND_CLASS = `${pokemon.types[0].type.name}-bg`;
    const POKEDATA_STATS = renderPokedataStats(pokemon, BACKGROUND_CLASS);
    return templatePokedata(pokemon, POKEDATA_IMAGE, POKEDATA_TYPES, POKEDATA_STATS, BACKGROUND_CLASS);
}

function showSearchedPokemon(pokemon) {
    const DIALOG = document.getElementById('pokedata-dialog');
    document.getElementById('pokedata-dialog-content').innerHTML = buildPokedataHTML(pokemon);
    DIALOG.classList.add('search-mode');
    DIALOG.showModal();
}

function openPokedataDialog() {
    const DIALOG = document.getElementById('pokedata-dialog');
    const IS_MOBILE = window.matchMedia('(max-width: 1400px)').matches;
    if (IS_MOBILE && !DIALOG.open) {
        DIALOG.showModal();
    }
}

function closePokedataDialog() {
    const DIALOG = document.getElementById('pokedata-dialog');
    DIALOG.classList.add('dialog-closing');
    setTimeout(finishClosingDialog, DIALOG_ANIMATION_DURATION);
}

function finishClosingDialog() {
    const DIALOG = document.getElementById('pokedata-dialog');
    DIALOG.classList.remove('dialog-closing', 'search-mode');
    DIALOG.close();
}

function closeDialogOnBackdrop(event) {
    const DIALOG = document.getElementById('pokedata-dialog');
    if (event.target === DIALOG) {
        closePokedataDialog();
    }
}

function handleDialogCancel(event) {
    event.preventDefault();
    closePokedataDialog();
}

function showPreviousPokemon() {
    if (!isLoading && currentPokemonId > 1) {
        showPokemonDetails(currentPokemonId - 1);
    }
}

async function showNextPokemon() {
    if (isLoading) {
        return;
    }
    const NEXT_ID = currentPokemonId + 1;
    if (NEXT_ID > POKEMON_DATA.length) {
        await loadPokemon();
    }
    if (NEXT_ID <= POKEMON_DATA.length) {
        showPokemonDetails(NEXT_ID);
    }
}

function updateNavigationButtons() {
    const PREVIOUS_BUTTONS = document.querySelectorAll('.previous-button');
    const NEXT_BUTTONS = document.querySelectorAll('.next-button');
    for (let buttonIndex = 0; buttonIndex < PREVIOUS_BUTTONS.length; buttonIndex++) {
        PREVIOUS_BUTTONS[buttonIndex].disabled = currentPokemonId <= 1;
        NEXT_BUTTONS[buttonIndex].disabled = currentPokemonId >= totalPokemon;
    }
}

function renderPokedataStats(pokemon, bgClass) {
    let leftPart = "";
    let rightPart = "";
    for (let statIndex = 0; statIndex < pokemon.stats.length; statIndex++) {
        const STAT_VALUE = pokemon.stats[statIndex].base_stat;
        const STAT_PERCENT = STAT_VALUE / MAX_STAT_VALUE * 100;
        const STAT_HTML = templatePokedataOneStat(STAT_LABELS[statIndex], STAT_VALUE, STAT_PERCENT);
        if (statIndex < 3) {
            leftPart += STAT_HTML;
        } else {
            rightPart += STAT_HTML;
        }
    }
    return templatePokedataStats(leftPart, rightPart, bgClass);
}

function getPokedataImage(pokemon) {
    if (pokemon.sprites.other.showdown.front_default) {
        return pokemon.sprites.other.showdown.front_default;
    } else {
        return pokemon.sprites.front_default;
    }
}

function renderPokedataTypes(types) {
    let typeHTML = "";
    for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
        const TYPE_NAME = types[typeIndex].type.name;
        typeHTML += templatePokedataType(TYPE_NAME);
    }
    return typeHTML;
}

function showLoadingScreen() {
    const LOADING_OVERLAY = document.getElementById('loading-overlay');
    LOADING_OVERLAY.showPopover();
    document.body.classList.add('no-scroll');
    isLoading = true;
}

function whenCardKeydown(event, ID) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPokemonDetails(ID);
    }
}

function hideLoadingScreen() {
    const LOADING_OVERLAY = document.getElementById('loading-overlay');
    LOADING_OVERLAY.hidePopover();
    document.body.classList.remove('no-scroll');
    isLoading = false;
}

function searchPokemon() {
    const SEARCH_INPUT = document.getElementById('search-input');
    const SEARCH_TERM = SEARCH_INPUT.value.trim().toLowerCase();
    if (SEARCH_TERM.length < 3) {
        renderSearchResults([]);
        return;
    }
    const RESULTS = ALL_POKEMON_NAMES.filter(function (name) {
        return name.includes(SEARCH_TERM);
    });
    showSearchResults(RESULTS);
}

function showSearchResults(results) {
    if (results.length === 0) {
        document.getElementById('search-results').innerHTML = templateNoMatch();
    } else {
        renderSearchResults(results);
    }
}

function renderSearchResults(results) {
    const SEARCH_RESULTS = document.getElementById('search-results');
    let resultsHTML = '';
    for (let resultIndex = 0; resultIndex < results.length; resultIndex++) {
        const NAME = results[resultIndex];
        const ID = ALL_POKEMON_NAMES.indexOf(NAME) + 1;
        resultsHTML += templateSearchResult(NAME, ID);
    }
    SEARCH_RESULTS.innerHTML = resultsHTML;
}

async function selectSearchResult(ID) {
    if (isLoading) {
        return;
    }
    clearSearch();
    showLoadingScreen();
    const SEARCHED_POKEMON = await getSinglePokemon(ID);
    hideLoadingScreen();
    if (SEARCHED_POKEMON) {
        showSearchedPokemon(SEARCHED_POKEMON);
    }
}

function clearSearch() {
    const SEARCH_INPUT = document.getElementById('search-input');
    SEARCH_INPUT.value = '';
    renderSearchResults([]);
}

function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}