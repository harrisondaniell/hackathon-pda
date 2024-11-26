export const authMiddleware = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.log("Erro de autorização:", err);
    return res.status(401).json({
      error: "Não autorizado",
      details: err.message,
    });
  }
  next(err);
};

export const checkAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      error: "Não autorizado",
      message: "Faça login para acessar este recurso",
    });
  }
};
