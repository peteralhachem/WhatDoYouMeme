import db from "./db.mjs";
import { scrypt, timingSafeEqual } from "crypto";

export const getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql_query = `SELECT * FROM User WHERE username=?`;
    db.get(sql_query, [username], (err, row) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (!row) {
        resolve(null); // user not found
        return;
      }

      let user = {
        id: row.id,
        username: row.username,
        name: row.name,
      };
      scrypt(password, row.salt, 32, function (err, hashedPassword) {
        if (err) {
          console.log(err);
          reject(err);
          return;
        } else if (
          !timingSafeEqual(Buffer.from(row.password, "hex"), hashedPassword)
        )
          resolve(null); // password is not correct -> return null
        else resolve(user); // username and password are both correct -> return the user object
      });
    });
  });
};

export const getHistorybyUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql_query = `SELECT * FROM Game WHERE user_id=? ORDER BY id DESC`;
    db.all(sql_query, [userId], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (rows.length === 0) {
        resolve(null); // user not found
        return;
      }
      const array_of_objects = rows.map((row) => {
        return { memes: JSON.parse(row.memes), scores: JSON.parse(row.scores) };
      });
      resolve(array_of_objects);
    });
  });
};
