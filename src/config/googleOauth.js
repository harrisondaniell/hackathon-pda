import { OAuth2Client } from "google-auth-library";
import { env } from "../env/index.js";

export const oAuth2Client = new OAuth2Client({
  clientId: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  redirectUri: env.GOOGLE_CALLBACK_URL,
});

export const generateGoogleAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const uri = env.GOOGLE_REDIRECT_URL;

  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    redirect_uri: uri,
  });
};

export const getGoogleUserInfo = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching Google user info:", error);
    throw new Error("Failed to fetch Google user info");
  }
};
