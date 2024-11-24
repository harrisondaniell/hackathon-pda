import jwt from "jsonwebtoken";
export class TokenService {
  constructor(
    secret,
    accessTokenExpiration = "1h",
    refreshTokenExpiration = "7d"
  ) {
    this.secret = secret;
    this.accessTokenExpiration = accessTokenExpiration;
    this.refreshTokenExpiration = refreshTokenExpiration;
  }

  generateAccessToken(userId) {
    return jwt.sign({ sub: userId }, this.secret, {
      expiresIn: this.accessTokenExpiration,
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ sub: userId }, this.secret, {
      expiresIn: this.refreshTokenExpiration,
    });
  }
}
