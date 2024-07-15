"use strict";

// imports
import express from "express";
import morgan from "morgan";
import cors from "cors";
import { getUser } from "./dao/UserDao.mjs";
import router from "./routers/userRouter.mjs";
const userRouter = router;

import memeRouter from "./routers/memeRouter.mjs";

// Passport-related imports
import passport from "passport";
import LocalStrategy from "passport-local";
import session from "express-session";

// init express
const app = new express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan("dev"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await getUser(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");

    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(
  session({
    secret: "This is my Secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

// routes
app.use("/api", userRouter);
app.use("/api/memes", memeRouter);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
