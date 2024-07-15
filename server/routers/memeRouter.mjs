import express from "express";
const memeRouter = express.Router();

import { check } from "express-validator";

import {
  getMemes,
  verifyAnswer,
  getRightCaptions,
  storeGame,
} from "../controllers/memeController.mjs";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  return next();
};

// check if meme_id is an int and if anwer is a string just create the array
const verify_middleware = [
  check("meme_id").isInt().notEmpty(),
  check("answer").isString().notEmpty(),
];

const correct_middleware = [
  check("meme_id").isInt().notEmpty(),
  check("selected_captions").isArray().notEmpty(),
];

const game_middleware = [
  check("user_id").isInt().notEmpty(),
  check("memes").isArray().notEmpty(),
  check("scores").isArray().notEmpty(),
];

memeRouter.get("/", getMemes);
memeRouter.post("/verify", verify_middleware, verifyAnswer);
memeRouter.post("/correct", correct_middleware, getRightCaptions);
memeRouter.post("/game", isLoggedIn, game_middleware, storeGame);
export default memeRouter;
