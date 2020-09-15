function makeId(max = 2) {
    const characters = "abcdefghijklmnopqrstuvwxyz1234567890";

    let id = "";

    for (let i = 0; i < max; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return id;
}

module.exports = { makeId };
