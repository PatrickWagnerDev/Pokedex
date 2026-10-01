function templatePokecard(p, typeIcons, cardColors) {
    return /*html*/`
        <article class="pokemon-card" style="${cardColors}">
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

function templatePokedata() {
    return /*html*/`
        <article>
            
        </article>
    `;
}