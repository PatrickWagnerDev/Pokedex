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

function templatePokedata(p, pokedataImage, pokedataTypes) {
    return /*html*/`
        <div class="pokedata">
            <div class="pokedata-top">
                <div class="pokedata-image-box">
                    <img class="pokedata-image" src="${pokedataImage}" alt="${capitalizeName(p.name)}">
                </div>
                <div class="pokedata-info">
                    <p class="pokedata-title">#${p.id} ${capitalizeName(p.name)}</p>
                    <div class="pokedata-types">
                        ${pokedataTypes}
                    </div>
                    <div class="pokedata-measures">
                        <div class="pokedata-measure">
                            <span>Height</span>
                            <span>${p.height / 10} m</span>
                        </div>
                        <div class="pokedata-measure">
                            <span>Weight</span>
                            <span>${p.weight / 10} kg</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pokedata-stats">

            </div>
        </div>
    `;
}

function templatePokedataType(T) {
    return /*html*/`
        <div class="pokedata-type ${T}">${T}</div>
    `;
}