import { AuthController } from "../controllers/auth.controller.js";
import { AuthenticateUseCase } from "../use-cases/authenticate.js";
import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { TokenService } from "../services/token.service.js";
import { env } from "../env/index.js";
import { cookieConfig } from "../config/cookie.config.js";

export function makeAuthController() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository);
  const tokenService = new TokenService(env.JWT_SECRET);

  return new AuthController(authenticateUseCase, tokenService, cookieConfig);
}
