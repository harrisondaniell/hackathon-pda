import jwt from "jsonwebtoken";
import { env } from "../env/index.js";

import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { AuthenticateUseCase } from "../use-cases/authenticate.js";
import { InvalidCredentialsError } from "../use-cases/errors/invalid-credentials-error.js";
import { z } from "zod";
import { cookieConfig } from "../config/cookie.config.js";

export async function authenticateController(req, res) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  console.log(env.JWT_SECRET, "minha chave");

  try {
    const { email, password } = req.body;

    const prismaUsersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

    const { user } = await authenticateUseCase.execute({ email, password });

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ sub: user.id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .cookie("refreshToken", refreshToken, cookieConfig.refreshToken)
      .status(200)
      .json({ token });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(409).send({ message: err.message });
    }

    throw err;
  }
}
