import express from "express";
import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { UserController } from "../controllers/user.controller.js";
import { makeAuthController } from "../factories/make-auth-controller.js";
import { verifyJWT } from "../middlewares/verify-jwt.js";
import { refresh } from "../controllers/refresh.js";

const userRouter = express.Router();

const usersRepository = new PrismaUsersRepository();

const userController = new UserController(usersRepository);
const authController = makeAuthController();

userRouter.post("/register", (req, res) => userController.createUser(req, res));
userRouter.post("/login", (req, res) => authController.authenticate(req, res));
userRouter.post("/sessions", (req, res) =>
  authController.authenticate(req, res)
);
userRouter.get("/me", verifyJWT, (req, res) =>
  authController.profile(req, res)
);
userRouter.patch("/token/refresh", refresh);
userRouter.patch("/update", (req, res) => userController.updateUser(req, res));

userRouter.get("/:email", (req, res) =>
  userController.getUserByEmail(req, res)
);

userRouter.get("/company/:companyEmail", (req, res) =>
  userController.getUsersByCompanyEmail(req, res)
);

userRouter.delete("/delete/:email", (req, res) =>
  userController.deleteUser(req, res)
);

export default userRouter;
