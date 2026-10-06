document.addEventListener("DOMContentLoaded", function () {
    let jokesArr = [];
    let currentI = 1;
    
    async function getJokesData(currentI) {
        const jokesResponse = await fetch(`https://official-joke-api.appspot.com/jokes/random`);
        const jokesData = await jokesResponse.json();
        const joke = { setup: jokesData.setup, punchline: jokesData.punchline, number: currentI }

        const exists = jokesArr.some(elem => elem.number === joke.number);
        if (!exists) jokesArr.push(joke);

        setup.innerText = jokesArr[currentI - 1].setup;
        punchline.innerText = jokesArr[currentI - 1].punchline;
        jokeNumber.innerText = jokesArr[currentI - 1].number;
        jokesAmount.innerText = jokesArr.length;
    }
    getJokesData(currentI);

    back.addEventListener("click", () => {
        if (currentI <= 1) return;
        currentI--;
        getJokesData(currentI);
    });

    forward.addEventListener("click", () => {
        currentI++;
        getJokesData(currentI);
    });
});