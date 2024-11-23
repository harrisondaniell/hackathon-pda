import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { AuthenticateUseCase } from "../use-cases/authenticate.js";
import { InvalidCredentialsError } from "../use-cases/errors/invalid-credentials-error.js";
import { z } from "zod";

export async function authenticateController(req, res) {
  const registerBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  try {
    const { email, password } = req.body;

    const prismaUsersRepository = new PrismaUsersRepository();
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);

    await authenticateUseCase.execute({ email, password });

    return res.status(200).send();
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(409).send({ message: err.message });
    }

    throw err;
  }
}
