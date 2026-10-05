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

function templateTypeIcon(icon, typeName) {
    return /*html*/`
        <img src="${icon}" class="type-icon" alt="${typeName}">
    `;
}

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

function templatePokedataType(typeName) {
    return /*html*/`
        <div class="pokedata-type ${typeName}">${typeName}</div>
    `;
}

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

function templateSearchResult(name, id) {
    return /*html*/`
        <button class="search-result" onclick="selectSearchResult(${id})">${capitalizeName(name)}</button>
    `;
}

function templateNoMatch() {
    return /*html*/`
        <p class="search-no-match" data-id="not-found">No match found</p>
    `;
}