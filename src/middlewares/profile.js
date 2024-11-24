export async function profile(req, res) {
  const teste = { message: "Perfil acessado com sucesso!" };
  res.status(200).send(teste);
}
