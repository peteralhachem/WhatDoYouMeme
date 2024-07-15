const apiUrl = "http://localhost:3001/api";

/* user auth */

async function login(credentials) {
  const credential_string = JSON.stringify(credentials);

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: credential_string,
      credentials: "include",
    });

    if (response.status === 401) return null; // wrong username or password

    if (!response.ok) {
      const errDetails = await response.text();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails}`
      );
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function logout() {
  try {
    const response = await fetch(`${apiUrl}/logout`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const errDetails = await response.text();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails}`
      );
    }

    return true;
  } catch (error) {
    console.log("I am getting this error from login\n", error);
    throw error;
  }
}

async function getCurrentSession() {
  try {
    const response = await fetch(`${apiUrl}/sessions/current`, {
      credentials: "include",
    });

    if (response.status === 401) return null; // no current session

    if (!response.ok) {
      const errDetails = await response.json();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails.error}`
      );
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.log("I am getting this error:\n", error);
    throw error;
  }
}

/* Memes API */

async function getMemes() {
  try {
    const response = await fetch(`${apiUrl}/memes`, {
      credentials: "include",
    });

    if (!response.ok) {
      const errDetails = await response.json();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails.error}`
      );
    }

    const object = await response.json();
    return object;
  } catch (error) {
    console.log("The error is present in API:\n", error);
    throw error;
  }
}

// verify correct answer
async function verifyAnswer(meme_id, answer) {
  const body = JSON.stringify({ meme_id, answer });
  try {
    const response = await fetch(`${apiUrl}/memes/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
      credentials: "include",
    });

    if (!response.ok) {
      const errDetails = await response.json();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails.error}`
      );
    }
    const object = await response.json();
    return object;
  } catch (error) {
    console.log("The error is present in API verifyAnswer:\n", error);
    throw error;
  }
}

// Get correct captions

async function getCorrectCaptions(meme_id, selected_captions) {
  try {
    const response = await fetch(`${apiUrl}/memes/correct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ meme_id, selected_captions }),
    });
    if (!response.ok) {
      const errDetails = await response.json();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails.error}`
      );
    }
    const object = await response.json();
    return object;
  } catch (err) {
    console.log("The error is present in API getCorrectCaptions:\n", err);
    throw err;
  }
}

// insert game into database

async function insertGame(user_id, memes, scores) {
  const body = JSON.stringify({ user_id, memes, scores });
  try {
    const response = await fetch(`${apiUrl}/memes/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
      credentials: "include",
    });

    if (!response.ok) {
      const errDetails = await response.json();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails.error}`
      );
    }
    const object = await response.json();
    return object;
  } catch (error) {
    console.log("The error is present in API insertGame:\n", error);
    throw error;
  }
}

// get history by user_id

async function getHistory(user_id) {
  try {
    const response = await fetch(`${apiUrl}/history/${user_id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errDetails = await response.json();
      throw new TypeError(
        `${response.statusText}${errDetails ? " - " : ""}${errDetails.error}`
      );
    }
    const object = await response.json();
    return object;
  } catch (error) {
    console.log("The error is present in API getHistory:\n", error);
    throw error;
  }
}

export {
  login,
  logout,
  getCurrentSession,
  getMemes,
  verifyAnswer,
  getCorrectCaptions,
  insertGame,
  getHistory,
};
