import { PrismaClient } from "@prisma/client";
import { InvalidCredentialsError } from "../use-cases/errors/invalid-credentials-error";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createUser(req, res) {
    const { name, email, password, companyEmail } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    try {
        // Error handling
        if (!name) throw new Error("O nome é obrigatório.");
        if (!email) throw new Error("O Email é obrigatório.");
        if (!password) throw new Error("A senha é obrigatória.");
        if (!companyEmail) throw new Error("O Email da empresa é obrigatório.");
        if (name.length > 255) throw new Error("O nome é muito longo.");
        if (email.length > 255) throw new Error("O Email é muito longo.");
        if (password.length > 255) throw new Error("A senha é muito longa.");
        if (companyEmail.length > 255) throw new Error("O Email da empresa é muito longo.");
        if (name.length < 3) throw new Error("O nome é muito curto.");
        if (email.length < 3) throw new Error("O Email é muito curto.");
        if (password.length < 8) throw new Error("A senha é muito curta.");
        if (companyEmail.length < 3) throw new Error("O Email da empresa é muito curto.");
        if (!emailPattern.test(email)) throw new Error("O Email é inválido.");
        if (!emailPattern.test(companyEmail)) throw new Error("O Email da empresa é inválido.");
        if (!passwordPattern.test(password)) throw new Error("A senha é inválida.");

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
            throw new InvalidCredentialsError("Invalid password");
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getUserByEmail(req, res) {
    const { email } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
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
