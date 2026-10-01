function init() {
    countPokemon();
}

async function renderPokecard(p) {
    let pokemonContainer = document.getElementById('pokemon-card');
    console.log(p);
    let typeIcons = await renderTypeIcons(p.types);
    pokemonContainer.innerHTML += templatePokecard(p, typeIcons);
}

async function renderTypeIcons(types) {
    let typeHTML = "";
    for (let i = 0; i < types.length; i++) {
        let typeName = types[i].type.name;
        let typeIcon = await getType(typeName);
        typeHTML += templateTypeIcon(typeIcon, typeName);
    }
    return typeHTML;
}

function capitalizeName(i) {
    return i.charAt(0).toUpperCase() + i.slice(1);
}

async function countPokemon() {
    for (let i = 0; i < 40; i++) {
        await getData(i+1);
    }
}