//список n постов
async function getPosts(n) {
const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts`);
const postsData = await postsResponse.json();
return postsData.slice(0, n);
}
getPosts(10).then(console.log);

//Список постов с комментами
async function getPostsWithComments(n) {
const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts`);
let postsData = await postsResponse.json();
postsData = postsData.slice(0, n);

return Promise.all(
        postsData.map(async post => {
            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`);
            const comments = await commentsResponse.json();

            return {
                userId: post.userId,
                id: post.id,
                title: post.title,
                body: post.body,
                comments: comments
            };
        })
    );
}
getPostsWithComments(10).then(console.log);

//Список постов с комментами и юзерами
async function getFullPosts(n) {
    const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    let postsData = await postsResponse.json();
    postsData = postsData.slice(0, n);

    return await Promise.all(
        postsData.map(async post => {
            const [comments, user] = await Promise.all([
            fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
                .then(r => r.json()),
            fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
                .then(r => r.json())
            ]);
            return {
                userId: post.userId,
                id: post.id,
                title: post.title,
                body: post.body,
                comments: comments,
                user: user
            };
        })
    );
}
getFullPosts(10).then(console.log);

//Список персонажей фильма
async function getCharacters(filmTitle) {
    const filmResponse = await fetch(`https://swapi.dev/api/films/?search=${filmTitle}`);
    const filmData = await filmResponse.json();
    const tenCharArray = filmData.results[0].characters.slice(0, 10);

    return Promise.all(
        tenCharArray.map(char =>
            fetch(char).then(data => data.json())
        )
    );
}
getCharacters("A New Hope").then(console.log);

//Список уникальных планет
async function getUniquePlanets(filmTitle) {
    const filmResponse = await fetch(`https://swapi.dev/api/films/?search=${filmTitle}`);
    const filmData = await filmResponse.json();
    const tenCharArray = filmData.results[0].characters.slice(0, 10);

    const characters = await Promise.all(
        tenCharArray.map(char =>
            fetch(char).then(data => data.json())
        )
    );

    const planets = await Promise.all(
        characters.map(
            char => fetch(char.homeworld).then(r => r.json())
        )
    )

    const characterPlanets = characters.map((char, i) => ({
        name: char.name,
        homeworld: planets[i].name
    }));
    
    const uniqPlanets = [...new Set(planets.map(p => p.name))];

    return { characters: characterPlanets, planets: uniqPlanets };
}

getUniquePlanets("A New Hope").then(console.log);