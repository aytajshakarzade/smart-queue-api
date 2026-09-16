const Database = require("better-sqlite3");

const db = new Database("queue.db");

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL
    )
`);

module.exports = db;