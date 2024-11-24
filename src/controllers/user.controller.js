import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function createUser(req, res) {
    const { name, email, password, companyEmail } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        if (!name || name.length > 255 || name.length < 3)
            throw new Error("O nome é inválido.");
        if (
            !email ||
            email.length > 255 ||
            email.length < 3 ||
            !emailPattern.test(email)
        )
            throw new Error("O Email é inválido.");
        if (
            !companyEmail ||
            companyEmail.length > 255 ||
            companyEmail.length < 3 ||
            !emailPattern.test(companyEmail)
        )
            throw new Error("O Email da empresa é inválido.");
        if (
            !password ||
            password.length > 255 ||
            password.length < 8 ||
            !passwordPattern.test(password)
        )
            throw new Error("A senha é inválida.");

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
        res.status(400).json({ error: "Usuário não encontrado" });
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
