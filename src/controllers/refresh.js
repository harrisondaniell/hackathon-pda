import jwt from "jsonwebtoken";
import { env } from "../env/index.js";
import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { cookieConfig } from "../config/cookie.config.js";

export async function refresh(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not provided" });
    }

    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET);

      const prismaUsersRepository = new PrismaUsersRepository();
      const user = await prismaUsersRepository.findById(decoded.sub);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const newToken = jwt.sign(
        { sub: user.id, email: user.email },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const newRefreshToken = jwt.sign(
        { sub: user.id, tokenVersion: user.tokenVersion },
        env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", newRefreshToken, cookieConfig.refreshToken);

      return res.json({ token: newToken });
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
