const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('todo.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, category TEXT)");
});

module.exports = db;
