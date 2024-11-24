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
