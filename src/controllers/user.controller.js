import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import z from "zod";
import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { RegisterUseCase } from "../use-cases/register.js";

const prisma = new PrismaClient();

export async function createUser(req, res) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    companyEmail: z.string(),
  });

  const { name, email, password, companyEmail } = registerBodySchema.parse(
    req.body
  );

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    const user = await registerUseCase.execute({
      name,
      email,
      password,
      companyEmail,
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getUserByEmail(req, res) {
  const prismaUsersRepository = new PrismaUsersRepository();
  const user = await prismaUsersRepository.findByEmail(req.params.email);

  try {
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getUsersByCompanyEmail(req, res) {
  const { companyEmail } = req.params;
  try {
    const users = await prisma.user.findMany({
      where: {
        companyEmail,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateUser(req, res) {
  const { name, email, password } = req.body;
  const updateData = {};

  if (name) {
    updateData.name = name;
  }

  if (email) {
    updateData.email = email;
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: updateData,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteUser(req, res) {
  const { email } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        email,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
