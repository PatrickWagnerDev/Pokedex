function init() {
    getData(1);
}

async function renderPokecard(p) {
    let pokemonContainer = document.getElementById('pokemon-card');
    console.log(p);
    let typeIcon = await getType(p.types[0].type.name);
    let typeIconTwo = await getType(p.types[1].type.name);
    pokemonContainer.innerHTML += /*html*/`
        <article class="pokemon-card" id="pokemon-card">
            <div class="card">
                <p>
                    #${p.id}
                </p>
                <p>
                    ${capitalizeName(p.name)}
                </p>
            </div>
            <div class="card">
                <img src="${typeIcon}" alt="${p.types[0].type.name}">
                <img src="${typeIconTwo}" alt="${p.types[1].type.name}">
            </div>
            <img src="${p.sprites.front_default}" alt="${capitalizeName(p.name)} sprite">
        </article>
    `        
}

function capitalizeName(i) {
    return i.charAt(0).toUpperCase() + i.slice(1);
}

function countPokemon() {
    for (let i = 0; i < 20; i++) {
        getData(i+1);
    }
}