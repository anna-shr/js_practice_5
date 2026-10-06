document.addEventListener("DOMContentLoaded", function () {
    async function getPokemonData(name) {
        try {
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
            if (!pokemonResponse.ok) {
                throw new Error(`Покемон "${name}" не найден (${pokemonResponse.status})`);
            }

            const pokemonData = await pokemonResponse.json();
            addInfo(pokemonData)
            function addInfo(pokemonData) {
                detailInfo.innerHTML = `<div>
                    <h1> ${pokemonData.name}</h1>
                    <img src="${pokemonData.sprites.front_default}">
                    <p><b>Характеристики</b></p>
                    <p><b>Вес: </b>${pokemonData.weight}</p>
                    <p><b>Рост: </b> ${pokemonData.height}</p>
                    <p><b>ID: </b> ${pokemonData.id}</p>
                    <p><b>Типы: </b></p>
                    <p class="types"></p>
                </div >`

                const typesP = document.querySelector(".types")
                const types = pokemonData.types;
                let typesArr = [];

                for (let type of types) {
                    typesArr.push(type.type.name);
                }
                typesP.innerText = typesArr.join(", ");
            }
        }
        catch (err) {
            function showMistake(pokemonData) {
                detailInfo.innerHTML = `<p><b>Ошибка загрузки покемона!</b></p>`
            }
            showMistake();
        }
    }
    button.addEventListener("click", () => {
        getPokemonData(input.value);
    });

    input.addEventListener("input", () => {
        button.disabled = input.value.trim() === "";
    });
});