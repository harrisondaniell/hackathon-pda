import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import z from "zod";
import { PrismaUsersRepository } from "../repositories/prisma/prisma.users.repository.js";
import { RegisterUseCase } from "../use-cases/register.js";
const prisma = new PrismaClient();

export async function createUser(req, res) {
  const registerBodySchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email().max(255),
    password: z.string().min(8).max(255),
    companyEmail: z.string().email().max(255),
  });

  try {
    const { name, email, password, companyEmail } = registerBodySchema.parse(
      req.body
    );
    const hashedPassword = await bcrypt.hash(password, 10);

    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    const user = await registerUseCase.execute({
      name,
      email,
      password: hashedPassword,
      companyEmail,
    });

    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(400).json({ error: error.message });
  }
}

export async function getUserByEmail(req, res) {
  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const user = await prismaUsersRepository.findByEmail(req.params.email);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

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
    res.status(400).json({ error: "Usuários não encontrados" });
  }
}

export async function updateUser(req, res) {
  const { name, email, password } = req.body;
  const updateData = {};

  try {
    if (name) {
      if (!name || name.length > 255 || name.length < 3)
        throw new Error("O nome é inválido.");
      updateData.name = name;
    }

    if (email) {
      if (
        !email ||
        email.length > 255 ||
        email.length < 3 ||
        !emailPattern.test(email)
      )
        throw new Error("O Email é inválido.");
      updateData.email = email;
    }

    if (password) {
      if (
        !password ||
        password.length > 255 ||
        password.length < 8 ||
        !passwordPattern.test(password)
      )
        throw new Error("A senha é inválida.");
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: updateData,
    });
    res.json(updatedUser);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Usuário não encontrado" });
    } else {
      res.status(400).json({ error: error.message });
    }
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
    if (error.code === "P2025") {
      res.status(404).json({ error: "Usuário não encontrado" });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
}
