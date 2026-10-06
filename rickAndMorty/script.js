document.addEventListener("DOMContentLoaded", function () {
    let currentName = "";
    let currentPage = 1;
    let charactersById = {};

    function showError(message) {
        infoBlock.innerHTML = `<p class="error">${message}</p>`;
    }

    async function getCharacterData(name, page = 1) {
        loader.hidden = false;
        try {
            const charactersResponse = await fetch(`https://rickandmortyapi.com/api/character/?name=${name}&page=${page}`)

            if (charactersResponse.status === 404) {
                showError("Нет результатов");
                return;
            }

            if (!charactersResponse.ok) {
                throw new Error(`${charactersResponse.status}`);
                showError("Ошибка");
                return;
            }

            const charactersData = await charactersResponse.json();
            console.log(charactersData);

            infoBlock.innerHTML = "";
            currentPageSpan.innerText = currentPage;
            pagesAmountSpan.innerText = charactersData.info.pages;

            addInfo(charactersData);

        } catch (err) {
            showError(`Ошибка: ${err.message}`);
        } finally {
            loader.hidden = true;
        }
    }

    function addInfo(charactersData) {
        for (let character of charactersData.results) {
            charactersById[character.id] = character;

            const infoDiv = document.createElement("div");
            infoDiv.dataset.id = character.id;
            infoDiv.classList.add("infodiv");
            infoDiv.innerHTML = `<div>
                        <h4>${character.name}</h4>
                        <img src="${character.image}">
                    </div >`
            infoBlock.appendChild(infoDiv);
        }
        console.log(charactersById)
    }

    infoBlock.addEventListener("click", async (e) => {
        const img = e.target.closest("img");
        if (!img) return;
        const card = img.closest(".infodiv");
        const id = Number(card.dataset.id);
        console.log(charactersById[id]);

        infoObj.innerHTML = `
                        <p>Created: ${charactersById[id].created}</p>
                        <p>Gender: ${charactersById[id].gender}</p>
                        <p>Id: ${charactersById[id].id}</p>
                        <p>Location: ${charactersById[id].location.name}</p>
                        <p>Name: ${charactersById[id].name}</p>
                        <p>Origin: ${charactersById[id].origin.name}</p>
                        <p>Status: ${charactersById[id].status}</p>
                    </div >`
    });

    let timeout;
    input.addEventListener("input", () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            currentName = input.value;
            currentPage = 1;
            getCharacterData(currentName, currentPage);
        }, 300);
    });

    forward.addEventListener("click", async () => {
        currentPage++;
        infoObj.innerHTML = "";
        if (currentPage > Number(pagesAmountSpan.innerText)) return;
        await getCharacterData(currentName, currentPage);
    });

    back.addEventListener("click", async () => {
        currentPage--;
        infoObj.innerHTML = "";
        if (currentPage < 1) return;
        await getCharacterData(currentName, currentPage);
    });
});