function templatePokecard(p, typeIcons) {
    return /*html*/`
        <article class="pokemon-card">
            <div class="card">
                <p>
                    #${p.id}
                </p>
                <p>
                    ${capitalizeName(p.name)}
                </p>
            </div>
            <div class="card">
                ${typeIcons}
            </div>
            <img src="${p.sprites.front_default}" alt="${capitalizeName(p.name)} sprite">
        </article>
    `;
}

function templateTypeIcon(icon, typeName) {
    return /*html*/`
        <img src="${icon}" alt="${typeName}">
    `;
}