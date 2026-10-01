function templatePokecard(p, typeIcons, cardColors) {
    return /*html*/`
        <article class="pokemon-card" style="${cardColors}" onclick="showPokemonDetails(${p.id})">
            <div class="pokemon-card-info">
                <p class="pokemon-id">#${p.id}</p>
                <p>${capitalizeName(p.name)}</p>
            </div>
            <div class="pokemon-types">
                ${typeIcons}
            </div>
            <div class="pokemon-sprite-wrapper">
                <img class="pokemon-sprite" src="${p.sprites.front_default}" alt="${capitalizeName(p.name)} sprite">
            </div>
        </article>
    `;
}

function templateTypeIcon(icon, typeName) {
    return /*html*/`
        <img src="${icon}" class="type-icon" alt="${typeName}">
    `;
}

function templatePokedata(p) {
    return /*html*/`
        <div class="pokedata">
            <div class="pokedata-top">
                <div class="pokedata-image-box">
                    <img class="pokedata-image" src="${p.sprites.other.showdown.front_default}" alt="${capitalizeName(p.name)}">
                </div>
                <div class="pokedata-info">
                    <p class="pokedata-title">#${p.id} ${capitalizeName(p.name)}</p>
                </div>
            </div>
            <div class="pokedata-stats">

            </div>
        </div>
    `;
}