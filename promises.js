//Сумма с задержкой (колбэк)
function delayedAdd(a, b, delay, callback) {
    setTimeout((() => { callback(null, a + b) }), delay);
}

delayedAdd(2, 3, 50, (err, sum) => {
    if (err) return console.error(err);
    console.log('sum =', sum); // 5
});

//Обработка ошибок в колбэках
function readConfig(path, callback) {
    if (typeof path !== "string") {
        callback(new Error("path must be a string"));
        return;
    }
    setTimeout(() => {
        callback(null, { path: path });
    }, 1000);
}

readConfig('/etc/app.json', (err, cfg) => console.log(err ? err.message : cfg)); // {path: '/etc/app.json }
readConfig(42, (err) => console.log(err)); // Error


//Промисифицированная сумма
function addAsync(a, b, delay = 50) {
    return new Promise(resolve => {
        setTimeout(() => resolve(a + b), delay);
    });
}
addAsync(2, 3).then(x => console.log(x)); // 5


//Функция wait
function wait(ms) {
    let x = new Promise((resolve) => setTimeout(resolve, ms));
    return x;
}

async function code() {
    await wait(1000);
    console.log('success')
}
code()

//Получить комментарий первого поста
getUser(1)
    .then(user => getPosts(user.id))
    .then(posts => getFirstPostComments(posts[0].id))
    .then(comments => console.log(comments));

async function getComments() {
    const user = await getUser(1);
    const posts = await getPosts(user.id);
    const comments = await getFirstPostComments(posts[0].id);
    return comments;
}

//реализация Promise.allSettled()
async function allSettled(promises) {
    let resultsObj = [];
    await Promise.all(
        promises.map(p =>
            Promise.resolve(p).then(
                value => (resultsObj.push({ status: "fulfilled", value: value})),
                error => (resultsObj.push({ status: "rejected", reason: error}))
            )
        )
    );
    return resultsObj;
}