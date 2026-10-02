let loadedPokemon = 0;
let currentPokemonId = 0;
let totalPokemon = 0;
const LOAD_AMOUNT = 40;
const POKEMON_DATA = [];
const MAX_STAT_VALUE = 255;
const STAT_LABELS = ['HP', 'ATK', 'DEF', 'SpATK', 'SpDEF', 'SPE'];
const DIALOG_ANIMATION_DURATION = 300;

async function init() {
    totalPokemon = await getPokemonCount();
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

async function renderPokecard(p) {
    const POKEMON_LIST = document.getElementById('pokemon-list');
    const TYPE_ICONS = await renderTypeIcons(p.types);
    const CARD_COLORS = getCardColors(p.types);
    POKEMON_LIST.insertAdjacentHTML('beforeend', templatePokecard(p, TYPE_ICONS, CARD_COLORS));
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

function getCardColors(types) {
    const FIRST_TYPE = types[0].type.name;
    let secondType = FIRST_TYPE;
    if (types.length > 1) {
        secondType = types[1].type.name;
    }
    return `--first-type-color: var(--type-${FIRST_TYPE}); --second-type-color: var(--type-${secondType});`;
}

function showPokemonDetails(ID) {
    const MY_POKEMON = POKEMON_DATA[ID - 1];
    const POKEDATA_IMAGE = getPokedataImage(MY_POKEMON);
    const POKEDATA_TYPES = renderPokedataTypes(MY_POKEMON.types);
    const BACKGROUND_CLASS = `${MY_POKEMON.types[0].type.name}-bg`;
    const POKEDATA_STATS = renderPokedataStats(MY_POKEMON, BACKGROUND_CLASS);
    const POKEDATA_HTML = templatePokedata(MY_POKEMON, POKEDATA_IMAGE, POKEDATA_TYPES, POKEDATA_STATS, BACKGROUND_CLASS);
    document.getElementById('pokedata').innerHTML = POKEDATA_HTML;
    document.getElementById('pokedata-dialog-content').innerHTML = POKEDATA_HTML;
    currentPokemonId = ID;
    updateNavigationButtons();
    openPokedataDialog();
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
    DIALOG.classList.remove('dialog-closing');
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
    if (currentPokemonId > 1) {
        showPokemonDetails(currentPokemonId - 1);
    }
}

async function showNextPokemon() {
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

function renderPokedataStats(p, bgClass) {
    let leftPart = "";
    let rightPart = "";
    for (let statIndex = 0; statIndex < p.stats.length; statIndex++) {
        const STAT_VALUE = p.stats[statIndex].base_stat;
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

function getPokedataImage(p) {
    if (p.sprites.other.showdown.front_default) {
        return p.sprites.other.showdown.front_default;
    } else {
        return p.sprites.front_default;
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
}

function hideLoadingScreen() {
    const LOADING_OVERLAY = document.getElementById('loading-overlay');
    LOADING_OVERLAY.hidePopover();
    document.body.classList.remove('no-scroll');
}

function capitalizeName(i) {
    return i.charAt(0).toUpperCase() + i.slice(1);
}