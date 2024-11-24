import express from "express";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import reservationRouter from "./routes/reservation.routes.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import cookieParser from "cookie-parser";
import { expressConfigjwt } from "./config/express-jwt.config.js";
import { authMiddleware } from "./middlewares/auth.middlewares.js";

const app = express();
app.use(corsMiddleware);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressConfigjwt);

app.use(authMiddleware);

app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/hotel", hotelRouter);
app.use("/reservation", reservationRouter);

export default app;
