import { expressjwt } from "express-jwt";

expressjwt;
export async function profile(req, res) {
  console.log(req.user);
  console.log(req.headers);
  const teste = { message: "Perfil acessado com sucesso!" };
  res.status(200).send(teste);
}
