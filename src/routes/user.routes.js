import express from "express";
import {
  createUser,
  getUserByEmail,
  getUsersByCompanyEmail,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticateController } from "../controllers/authenticate.controller.js";
import { profile } from "../middlewares/profile.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import { refresh } from "../controllers/refresh.js";

const userRouter = express.Router();

userRouter.post("/register", createUser);
userRouter.post("/login", authenticateController);
userRouter.post("/sessions", authenticateController);
userRouter.get("/me", verifyJWT, profile);

userRouter.patch("/token/refresh", refresh);

userRouter.get("/company/:companyEmail", getUsersByCompanyEmail);
userRouter.get("/:email", getUserByEmail);
userRouter.patch("/update", updateUser);
userRouter.delete("/delete/:email", deleteUser);

export default userRouter;
