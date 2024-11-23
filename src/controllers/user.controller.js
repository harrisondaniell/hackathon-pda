import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createUser(req, res) {
  const { name, email, password, companyEmail } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        companyEmail,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getUserByEmail(req, res) {
  const { email } = req.params;
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
