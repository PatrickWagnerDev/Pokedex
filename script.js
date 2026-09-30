function init() {
    getData();
}

function renderPokecard(p) {
    let pokemonContainer = document.getElementById('pokemon-card');
    console.log(p);
    

    for (let i = 0; i < p.results.length; i++) {
        pokemonContainer.innerHTML += /*html*/`
            <article class="pokemon-card" id="pokemon-card">
                    <div class="card">
                        <p>
                            #${i+1}
                        </p>
                        <p>
                            ${capitalizeName(p.results[i].name)}
                        </p>
                    </div>
                    <div class="card">
                        <button>leaf</button>
                        <button>poison</button>
                    </div>
                    <img src="" alt="">
                </article>
        `        
    }
}

function capitalizeName(i) {
    return i.charAt(0).toUpperCase() + i.slice(1);
}