import { expressjwt } from "express-jwt";
import { env } from "../env/index.js";

export const expressConfigjwt = expressjwt({
  secret: env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "auth",
}).unless({
  path: [
    "/user/login",
    "/user/register",
    "/user/token/refresh",
    "/hotel/register",
    "/hotel/login",
    "/company/create",
    "/auth",
    "/auth/google",
    "/auth/google/callback",

    { url: /^\/public\/.*/, methods: ["GET"] },
  ],
});
