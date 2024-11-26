import { Router } from "express";
import {
  googleAuthRedirect,
  googleAuthCallback,
  logout,
} from "../controllers/auth-google.controller.js";

const Authrouter = Router();

Authrouter.get("/google", googleAuthRedirect);
Authrouter.get("/", (req, res) => {
  res.send('<a href="/auth/google">Entrar com o Google</a>');
});
Authrouter.get("/google/callback", googleAuthCallback);
Authrouter.get("/logout", logout);

export default Authrouter;
