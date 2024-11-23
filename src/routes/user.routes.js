import express from "express";
import {
  createUser,
  loginUser,
  getUserByEmail,
  getUsersByCompanyEmail,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { authenticateController } from "../controllers/authenticate.js";

const userRouter = express.Router();

userRouter.get("/:email", getUserByEmail);
userRouter.get("/company/:companyEmail", getUsersByCompanyEmail);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.patch("/update", updateUser);
userRouter.delete("/delete/:email", deleteUser);
userRouter.post("/sessions", authenticateController);

export default userRouter;
