import { validationResult } from "express-validator";

import {
  getCorrectCaptions,
  getGetForNonAuthenticatedUser,
  verifyAnswerService,
  getGetForAuthenticatedUser,
  storeGameService,
} from "../services/memeServices.mjs";

export const getMemes = async (req, res) => {
  try {
    const isAuthenticated = req.isAuthenticated();
    if (!isAuthenticated) {
      const result = await getGetForNonAuthenticatedUser();
      if (result.error) {
        return res.status(result.code).json(result.error);
      }
      return res.status(result.code).json(result.obj);
    } else {
      const result = await getGetForAuthenticatedUser();
      if (result.error) {
        return res.status(result.code).json(result.error);
      }
      return res.status(result.code).json(result.obj);
    }
  } catch (err) {
    console.log("I am getting error in the memeController\n", err.message);
    return res.status(500).json({
      error: "Generic error occurred during meme loading",
    });
  }
};

export const verifyAnswer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ validationErrors: errors.array() });
    }
    const { meme_id, answer } = req.body;
    const result = await verifyAnswerService(meme_id, answer);
    if (result.error) {
      return res.status(result.code).json({ error });
    }
    return res.status(result.code).json(result.obj);
  } catch (err) {
    console.log(
      "I am getting error in the memeController verifyAnswer\n",
      err.message
    );
    return res.status(500).json({
      error: "Generic error occurred while verifying an answer",
    });
  }
};

export const getRightCaptions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ validationErrors: errors.array() });
    }
    const { meme_id, selected_captions } = req.body;
    const result = await getCorrectCaptions(meme_id, selected_captions);
    if (result.error) {
      return res.status(result.code).json(result.error);
    }
    return res.status(result.code).json(result.obj);
  } catch (err) {
    console.log(
      "I am getting error in the memeController getRightCaptions\n",
      err.message
    );
    return res.status(500).json({
      error: "Generic error occurred while getting the captions",
    });
  }
};

export const storeGame = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ validationErrors: errors.array() });
    }
    const { user_id, memes, scores } = req.body;
    const url = memes.map((meme) => meme.url);
    const result = await storeGameService(
      user_id,
      JSON.stringify(url),
      JSON.stringify(scores)
    );
    if (result.error) {
      return res.status(result.code).json(result.error);
    }
    return res.status(result.code).json("success insertion");
  } catch (err) {
    console.log(
      "I am getting error in the memeController storeGame\n",
      err.message
    );
    return res.status(500).json({
      error: "Generic error occurred during game insertion",
    });
  }
};
