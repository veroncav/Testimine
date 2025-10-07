async function getPost(id, fetch) {
    const url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    const res = await fetch(url);
    if (!res.ok) {
        console.log(`Error: ${res.status}`);
    }
    return res.json();
}

async function hello(name) {
    return `Hello, ${name}!`;
}

async function doubleNumber(n) {
    return n * 2;
}

module.exports = { getPost };