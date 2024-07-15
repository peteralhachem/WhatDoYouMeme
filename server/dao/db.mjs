/** DB access module **/

import sqlite3 from "sqlite3";
const dbSource = "./dao/memes.db";

// Opening the database
const db = new sqlite3.Database(dbSource, (err) => {
  if (err) throw err;
});

export default db;
