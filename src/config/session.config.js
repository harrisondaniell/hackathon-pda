import session from "express-session";
import { env } from "../env/index.js";

export const sessionConfig = session({
  secret: env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  },
});
