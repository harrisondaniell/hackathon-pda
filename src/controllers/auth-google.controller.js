import {
  generateGoogleAuthUrl,
  getGoogleUserInfo,
} from "../config/googleOauth.js";

export const googleAuthRedirect = (req, res) => {
  const url = generateGoogleAuthUrl();
  res.redirect(url);
};

export const googleAuthCallback = async (req, res) => {
  try {
    const userInfo = await getGoogleUserInfo(req.query.code);

    req.session.user = {
      id: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    };

    res.redirect("/perfil");
  } catch (error) {
    console.error("Erro na autenticação:", error);
    res.status(500).send("Erro na autenticação");
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro no logout:", err);
    }
    res.redirect("/");
  });
};

export const getProfile = (req, res) => {
  res.json(req.session.user);
};
