import { Router } from "express";

import { authenticateController } from "../controllers/authenticate.js";

const userRouter = Router();

userRouter.post("/sessions", authenticateController);

export default userRouter;
