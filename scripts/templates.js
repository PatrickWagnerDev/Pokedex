/**
 * Creates the HTML for a Pokémon card in the list.
 * @param {Object} pokemon - The Pokémon data from the API.
 * @param {string} typeIcons - The HTML of the type icons.
 * @param {string} cardColors - The CSS variables for the background gradient.
 * @returns {string} The HTML of the card.
 */
function templatePokecard(pokemon, typeIcons, cardColors) {
    return /*html*/`
        <article aria-label="Show details of ${capitalizeName(pokemon.name)}" role="button" tabindex="0" class="pokemon-card" style="${cardColors}" onclick="showPokemonDetails(${pokemon.id})" onkeydown="whenCardKeydown(event, ${pokemon.id})" data-id="card">
            <div class="pokemon-card-main">
                <div class="pokemon-card-info">
                    <p class="pokemon-id">#${pokemon.id}</p>
                    <p class="pokemon-name">${capitalizeName(pokemon.name)}</p>
                </div>
                <div class="pokemon-types">
                    ${typeIcons}
                </div>
            </div>
            <div class="pokemon-sprite-wrapper">
                <img class="pokemon-sprite" src="${pokemon.sprites.front_default}" alt="${capitalizeName(pokemon.name)} sprite" data-id="card-image">
            </div>
        </article>
    `;
}

/**
 * Creates the HTML for a single type icon.
 * @param {string} icon - The URL of the icon.
 * @param {string} typeName - The name of the type.
 * @returns {string} The HTML of the icon.
 */
function templateTypeIcon(icon, typeName) {
    return /*html*/`
        <img src="${icon}" class="type-icon" alt="${typeName}">
    `;
}

/**
 * Creates the HTML for the detail view of a Pokémon.
 * @param {Object} pokemon - The Pokémon data from the API.
 * @param {string} pokedataImage - The URL of the image.
 * @param {string} pokedataTypes - The HTML of the type labels.
 * @param {string} pokedataStats - The HTML of the stats box.
 * @param {string} bgClass - The CSS class for the background image.
 * @returns {string} The HTML of the detail view.
 */
function templatePokedata(pokemon, pokedataImage, pokedataTypes, pokedataStats, bgClass) {
    return /*html*/`
        <div class="pokedata">
            <div class="pokedata-top">
                <div class="pokedata-image-box ${bgClass}">
                    <img class="pokedata-image" src="${pokedataImage}" alt="${capitalizeName(pokemon.name)}" data-id="dialog-image">
                </div>
                <div class="pokedata-info">
                    <p class="pokedata-title">#${pokemon.id} ${capitalizeName(pokemon.name)}</p>
                    <div class="pokedata-types">
                        ${pokedataTypes}
                    </div>
                    <div class="pokedata-measures">
                        <div class="pokedata-data">
                            <span>Height</span>
                            <span>${pokemon.height / 10} m</span>
                        </div>
                        <div class="pokedata-data">
                            <span>Weight</span>
                            <span>${pokemon.weight / 10} kg</span>
                        </div>
                    </div>
                </div>
            </div>
            ${pokedataStats}
        </div>
    `;
}

/**
 * Creates the HTML for a type label in the detail view.
 * @param {string} typeName - The name of the type.
 * @returns {string} The HTML of the type label.
 */
function templatePokedataType(typeName) {
    return /*html*/`
        <div class="pokedata-type ${typeName}">${typeName}</div>
    `;
}

/**
 * Creates the HTML for the stats box with two columns.
 * @param {string} leftPart - The HTML of the stats in the left column.
 * @param {string} rightPart - The HTML of the stats in the right column.
 * @param {string} bgClass - The CSS class for the background image.
 * @returns {string} The HTML of the stats box.
 */
function templatePokedataStats(leftPart, rightPart, bgClass) {
    return /*html*/`
        <div class="pokedata-stats ${bgClass}">
            <div class="stats-column">
                ${leftPart}
            </div>
            <div class="stats-column">
                ${rightPart}
            </div>
        </div>
    `;
}

/**
 * Creates the HTML for a single stat with its bar.
 * @param {string} label - The short name of the stat.
 * @param {number} value - The value of the stat.
 * @param {number} percent - The width of the bar in percent.
 * @returns {string} The HTML of the stat.
 */
function templatePokedataOneStat(label, value, percent) {
    return /*html*/`
        <div class="stat-row">
            <span class="stat-label">${label}</span>
            <div class="stat-bar">
                <div class="stat-bar-fill" style="width: ${percent}%"></div>
                <span class="stat-value">${value}</span>
            </div>
        </div>
    `;
}

/**
 * Creates the HTML for a search result button.
 * @param {string} name - The name of the Pokémon.
 * @param {number} id - The id of the Pokémon.
 * @returns {string} The HTML of the search result.
 */
function templateSearchResult(name, id) {
    return /*html*/`
        <button class="search-result" onclick="selectSearchResult(${id})">${capitalizeName(name)}</button>
    `;
}

/**
 * Creates the HTML for the message when no Pokémon matches the search.
 * @returns {string} The HTML of the message.
 */
function templateNoMatch() {
    return /*html*/`
        <p class="search-no-match" data-id="not-found">No match found</p>
    `;
}