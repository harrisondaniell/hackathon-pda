import express from "express";
import { env } from "./env/index.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import reservationRouter from "./routes/reservation.routes.js";
import { expressjwt } from "express-jwt";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressjwt({
    secret: env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth",
  }).unless({
    path: [
      "/user/login",
      "/user/register",
      "/user/token/refresh",

      { url: /^\/public\/.*/, methods: ["GET"] },
    ],
  })
);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log("Erro de autorização:", err);
    return res.status(401).json({
      error: "Não autorizado",
      details: err.message,
    });
  }
  next(err);
});

app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/hotel", hotelRouter);
app.use("/reservation", reservationRouter);

export default app;
