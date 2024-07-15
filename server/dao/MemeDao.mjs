import db from "./db.mjs";

export const getMemes = (num_rounds) => {
  return new Promise((resolve, reject) => {
    const sql_query = `SELECT * FROM Meme ORDER BY RANDOM() LIMIT ?`;
    db.all(sql_query, [num_rounds], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (rows.length === 0) {
        resolve(null); // user not found
        return;
      }
      const memes = rows;
      resolve(memes);
    });
  });
};

export const get_all_correct_captions = (meme_id) => {
  return new Promise((resolve, reject) => {
    const sql_query = ` SELECT text FROM Captions JOIN Middle ON Captions.id = Middle.caption_id WHERE Middle.meme_id =?;`;
    db.all(sql_query, [meme_id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (rows.length === 0) {
        resolve(null); // meme not found
        return;
      }
      const captions = rows.map((row) => {
        return {
          caption: row.text,
        };
      });
      resolve(captions);
    });
  });
};

export const get_correct_captions = (meme_id) => {
  return new Promise((resolve, reject) => {
    const sql_query = ` SELECT text FROM Captions JOIN Middle ON Captions.id = Middle.caption_id WHERE Middle.meme_id =? ORDER BY RANDOM() LIMIT 2;`;
    db.all(sql_query, [meme_id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (rows.length === 0) {
        resolve(null); // user not found
        return;
      }
      const captions = rows.map((row) => {
        return {
          caption: row.text,
        };
      });
      resolve(captions);
    });
  });
};

export const get_incorrect_captions = (meme_id) => {
  return new Promise((resolve, reject) => {
    const sql_query = ` SELECT text FROM Captions WHERE id NOT IN ( SELECT caption_id FROM Middle WHERE meme_id = ?) ORDER BY RANDOM() LIMIT 5`;
    db.all(sql_query, [meme_id], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if (rows.length === 0) {
        resolve(null); // user not found
        return;
      }
      const captions = rows.map((row) => {
        return {
          caption: row.text,
        };
      });
      resolve(captions);
    });
  });
};

// insert a game into the Game table (user_id, memes, scores)

export const insert_game = (user_id, memes, scores) => {
  return new Promise((resolve, reject) => {
    const sql_query = `INSERT INTO Game (user_id, memes, scores) VALUES (?,?,?)`;
    db.run(sql_query, [user_id, memes, scores], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      // returns an object with the values in it.
      resolve({ id: user_id, memes: memes, scores: scores });
    });
  });
};
