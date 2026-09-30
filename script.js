function init() {
    getData();
}

function renderPokecard(p) {
    let pokemonContainer = document.getElementById('pokemon-card');
    console.log(p);
    

    for (let i = 19; i < p.results.length; i++) {
        pokemonContainer.innerHTML += /*html*/`
            <article class="pokemon-card" id="pokemon-card">
                    <div class="card">
                        <p>
                            #${p.results[i]+1}
                        </p>
                        <p>
                            ${p.results[i].name}
                        </p>
                    </div>
                    <div class="card">
                        <button>leaf</button>
                        <button>poison</button>
                    </div>
                    <button>Bild</button>
                </article>
        `        
    }
}