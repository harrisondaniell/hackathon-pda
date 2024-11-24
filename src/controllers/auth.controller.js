import { z } from "zod";
import { InvalidCredentialsError } from "../use-cases/errors/invalid-credentials-error.js";

const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  constructor(authenticateUseCase, tokenService, cookieConfig) {
    this.authenticateUseCase = authenticateUseCase;
    this.tokenService = tokenService;
    this.cookieConfig = cookieConfig;
  }

  async authenticate(req, res) {
    try {
      const { email, password } = registerBodySchema.parse(req.body);

      const { user } = await this.authenticateUseCase.execute({
        email,
        password,
      });

      const token = this.tokenService.generateAccessToken(user.id);
      const refreshToken = this.tokenService.generateRefreshToken(user.id);

      res
        .cookie("refreshToken", refreshToken, this.cookieConfig.refreshToken)
        .status(200)
        .json({ token });
    } catch (err) {
      if (err instanceof InvalidCredentialsError) {
        return res.status(409).send({ message: err.message });
      }
      throw err;
    }
  }
}
