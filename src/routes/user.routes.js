import express from "express";
import {
  createUser,
  loginUser,
  getUserByEmail,
  getUsersByCompanyEmail,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticateController } from "../controllers/authenticate.controller.js";

const userRouter = express.Router();

userRouter.get("/:email", getUserByEmail);
userRouter.get("/company/:companyEmail", getUsersByCompanyEmail);
userRouter.post("/register", createUser);
userRouter.post("/login", authenticateController);
userRouter.patch("/update", updateUser);
userRouter.delete("/delete/:email", deleteUser);
userRouter.post("/sessions", authenticateController);

export default userRouter;
