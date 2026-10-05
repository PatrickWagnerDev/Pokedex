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

/**
 * Starts the app by loading the Pokémon count, all names and the first Pokémon.
 */
async function init() {
    totalPokemon = await getPokemonCount();
    getAllPokemonNames(totalPokemon);
    loadPokemon();
}

/**
 * Loads the next batch of Pokémon with loading screen and updates the load more button.
 */
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

/**
 * Loads the next batch of Pokémon one after another and updates the counter.
 */
async function loadNextPokemon() {
    const START_ID = loadedPokemon + 1;
    const END_ID = Math.min(loadedPokemon + LOAD_AMOUNT, totalPokemon);
    for (let i = START_ID; i <= END_ID; i++) {
        await getData(i);
    }
    loadedPokemon = END_ID;
}

/**
 * Renders the card of a Pokémon at the end of the list.
 * @param {Object} pokemon - The Pokémon data from the API.
 */
async function renderPokecard(pokemon) {
    const POKEMON_LIST = document.getElementById('pokemon-list');
    const TYPE_ICONS = await renderTypeIcons(pokemon.types);
    const CARD_COLORS = getCardColors(pokemon.types);
    POKEMON_LIST.insertAdjacentHTML('beforeend', templatePokecard(pokemon, TYPE_ICONS, CARD_COLORS));
}

/**
 * Creates the HTML of the type icons for a Pokémon card.
 * @param {Object[]} types - The types of the Pokémon from the API.
 * @returns {Promise<string>} The HTML of all type icons.
 */
async function renderTypeIcons(types) {
    let typeHTML = "";
    for (let i = 0; i < types.length; i++) {
        const TYPE_NAME = types[i].type.name;
        const TYPE_ICON = await getTypeIcon(TYPE_NAME);
        typeHTML += templateTypeIcon(TYPE_ICON, TYPE_NAME);
    }
    return typeHTML;
}

/**
 * Returns the icon URL of a type from the cache or loads it once from the API.
 * @param {string} typeName - The name of the type.
 * @returns {Promise<string|undefined>} The URL of the icon, or undefined if loading failed.
 */
async function getTypeIcon(typeName) {
    if (!TYPE_ICON_CACHE[typeName]) {
        TYPE_ICON_CACHE[typeName] = await getType(typeName);
    }
    return TYPE_ICON_CACHE[typeName];
}

/**
 * Creates the CSS variables for the background gradient of a Pokémon card.
 * @param {Object[]} types - The types of the Pokémon from the API.
 * @returns {string} The CSS variables for both type colors.
 */
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

/**
 * Shows the details of a loaded Pokémon in the right screen and in the dialog.
 * @param {number} ID - The id of the Pokémon.
 */
function showPokemonDetails(ID) {
    const POKEDATA_HTML = buildPokedataHTML(POKEMON_DATA[ID - 1]);
    document.getElementById('pokedata').innerHTML = POKEDATA_HTML;
    document.getElementById('pokedata-dialog-content').innerHTML = POKEDATA_HTML;
    currentPokemonId = ID;
    updateNavigationButtons();
    openPokedataDialog();
}

/**
 * Creates the HTML of the detail view for a Pokémon.
 * @param {Object} pokemon - The Pokémon data from the API.
 * @returns {string} The HTML of the detail view.
 */
function buildPokedataHTML(pokemon) {
    const POKEDATA_IMAGE = getPokedataImage(pokemon);
    const POKEDATA_TYPES = renderPokedataTypes(pokemon.types);
    const BACKGROUND_CLASS = `${pokemon.types[0].type.name}-bg`;
    const POKEDATA_STATS = renderPokedataStats(pokemon, BACKGROUND_CLASS);
    return templatePokedata(pokemon, POKEDATA_IMAGE, POKEDATA_TYPES, POKEDATA_STATS, BACKGROUND_CLASS);
}

/**
 * Shows a searched Pokémon in the dialog without navigation buttons.
 * @param {Object} pokemon - The Pokémon data from the API.
 */
function showSearchedPokemon(pokemon) {
    const DIALOG = document.getElementById('pokedata-dialog');
    document.getElementById('pokedata-dialog-content').innerHTML = buildPokedataHTML(pokemon);
    DIALOG.classList.add('search-mode');
    DIALOG.showModal();
}

/**
 * Opens the dialog on small screens if it is not already open.
 */
function openPokedataDialog() {
    const DIALOG = document.getElementById('pokedata-dialog');
    const IS_MOBILE = window.matchMedia('(max-width: 1400px)').matches;
    if (IS_MOBILE && !DIALOG.open) {
        DIALOG.showModal();
    }
}

/**
 * Starts the closing animation of the dialog.
 */
function closePokedataDialog() {
    const DIALOG = document.getElementById('pokedata-dialog');
    DIALOG.classList.add('dialog-closing');
    setTimeout(finishClosingDialog, DIALOG_ANIMATION_DURATION);
}

/**
 * Closes the dialog after the animation and removes the extra classes.
 */
function finishClosingDialog() {
    const DIALOG = document.getElementById('pokedata-dialog');
    DIALOG.classList.remove('dialog-closing', 'search-mode');
    DIALOG.close();
}

/**
 * Closes the dialog when the backdrop outside of it is clicked.
 * @param {MouseEvent} event - The click event.
 */
function closeDialogOnBackdrop(event) {
    const DIALOG = document.getElementById('pokedata-dialog');
    if (event.target === DIALOG) {
        closePokedataDialog();
    }
}

/**
 * Prevents the instant closing with Escape and closes the dialog with animation.
 * @param {Event} event - The cancel event of the dialog.
 */
function handleDialogCancel(event) {
    event.preventDefault();
    closePokedataDialog();
}

/**
 * Shows the previous Pokémon if it exists and nothing is loading.
 */
function showPreviousPokemon() {
    if (!isLoading && currentPokemonId > 1) {
        showPokemonDetails(currentPokemonId - 1);
    }
}

/**
 * Shows the next Pokémon and loads the next batch first if needed.
 */
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

/**
 * Enables or disables all previous and next buttons depending on the current Pokémon.
 */
function updateNavigationButtons() {
    const PREVIOUS_BUTTONS = document.querySelectorAll('.previous-button');
    const NEXT_BUTTONS = document.querySelectorAll('.next-button');
    for (let i = 0; i < PREVIOUS_BUTTONS.length; i++) {
        PREVIOUS_BUTTONS[i].disabled = currentPokemonId <= 1;
        NEXT_BUTTONS[i].disabled = currentPokemonId >= totalPokemon;
    }
}

/**
 * Creates the HTML of the stats box and splits the stats into two columns.
 * @param {Object} pokemon - The Pokémon data from the API.
 * @param {string} bgClass - The CSS class for the background image.
 * @returns {string} The HTML of the stats box.
 */
function renderPokedataStats(pokemon, bgClass) {
    let leftPart = "";
    let rightPart = "";
    for (let i = 0; i < pokemon.stats.length; i++) {
        const STAT_VALUE = pokemon.stats[i].base_stat;
        const STAT_PERCENT = STAT_VALUE / MAX_STAT_VALUE * 100;
        const STAT_HTML = templatePokedataOneStat(STAT_LABELS[i], STAT_VALUE, STAT_PERCENT);
        if (i < 3) {
            leftPart += STAT_HTML;
        } else {
            rightPart += STAT_HTML;
        }
    }
    return templatePokedataStats(leftPart, rightPart, bgClass);
}

/**
 * Returns the animated image of a Pokémon or the default sprite if none exists.
 * @param {Object} pokemon - The Pokémon data from the API.
 * @returns {string} The URL of the image.
 */
function getPokedataImage(pokemon) {
    if (pokemon.sprites.other.showdown.front_default) {
        return pokemon.sprites.other.showdown.front_default;
    } else {
        return pokemon.sprites.front_default;
    }
}

/**
 * Creates the HTML of the type labels for the detail view.
 * @param {Object[]} types - The types of the Pokémon from the API.
 * @returns {string} The HTML of all type labels.
 */
function renderPokedataTypes(types) {
    let typeHTML = "";
    for (let i = 0; i < types.length; i++) {
        const TYPE_NAME = types[i].type.name;
        typeHTML += templatePokedataType(TYPE_NAME);
    }
    return typeHTML;
}

/**
 * Shows the loading screen and blocks scrolling and navigation.
 */
function showLoadingScreen() {
    const LOADING_OVERLAY = document.getElementById('loading-overlay');
    LOADING_OVERLAY.showPopover();
    document.body.classList.add('no-scroll');
    isLoading = true;
}

/**
 * Opens the details of a Pokémon card when Enter or Space is pressed.
 * @param {KeyboardEvent} event - The keydown event.
 * @param {number} ID - The id of the Pokémon.
 */
function whenCardKeydown(event, ID) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPokemonDetails(ID);
    }
}

/**
 * Hides the loading screen and allows scrolling and navigation again.
 */
function hideLoadingScreen() {
    const LOADING_OVERLAY = document.getElementById('loading-overlay');
    LOADING_OVERLAY.hidePopover();
    document.body.classList.remove('no-scroll');
    isLoading = false;
}

/**
 * Searches all Pokémon names for the input from at least three letters on.
 */
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

/**
 * Shows the search results or a message if nothing was found.
 * @param {string[]} results - The names of the found Pokémon.
 */
function showSearchResults(results) {
    if (results.length === 0) {
        document.getElementById('search-results').innerHTML = templateNoMatch();
    } else {
        renderSearchResults(results);
    }
}

/**
 * Renders the search results as buttons below the search field.
 * @param {string[]} results - The names of the found Pokémon.
 */
function renderSearchResults(results) {
    const SEARCH_RESULTS = document.getElementById('search-results');
    let resultsHTML = '';
    for (let i = 0; i < results.length; i++) {
        const NAME = results[i];
        const ID = ALL_POKEMON_NAMES.indexOf(NAME) + 1;
        resultsHTML += templateSearchResult(NAME, ID);
    }
    SEARCH_RESULTS.innerHTML = resultsHTML;
}

/**
 * Loads the selected Pokémon from the search and shows it in the dialog.
 * @param {number} ID - The id of the Pokémon.
 */
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

/**
 * Clears the search field and hides the search results.
 */
function clearSearch() {
    const SEARCH_INPUT = document.getElementById('search-input');
    SEARCH_INPUT.value = '';
    renderSearchResults([]);
}

/**
 * Returns the name with the first letter in upper case.
 * @param {string} name - The name to change.
 * @returns {string} The name with an upper case first letter.
 */
function capitalizeName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}