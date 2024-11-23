import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import companyRouter from "./routes/company.routes.js";
import hotelRouter from "./routes/hotel.routes.js";

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRouter);
app.use("/company", companyRouter);
app.use("/hotel", hotelRouter);

export default app;
