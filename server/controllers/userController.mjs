import passport from "passport";
import { getHistorybyUserId } from "../dao/UserDao.mjs";
import { validationResult } from "express-validator";

// GET  /sessions/current
async function getCurrentSession(req, res) {
  if (req.isAuthenticated()) {
    return res.status(200).json(req.user);
  } else return res.status(401).json({ error: "Unauthorized" });
}

// POST  /login
async function login(req, res, next) {
  passport.authenticate("local", (error, user, info) => {
    if (error) return next(error);

    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (error) => {
      if (error) return next(error);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
}

// DELETE  /logout
async function logout(req, res) {
  req.logout(() => {
    res.end();
  });
}

// Get history by user_id
async function getUserHistory(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user_id = req.params.userId;

  // transform user_id to integer
  const id = parseInt(user_id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user_id" });
  }

  const history = await getHistorybyUserId(id);
  return res.status(200).json(history);
}

export { getCurrentSession, login, logout, getUserHistory };
