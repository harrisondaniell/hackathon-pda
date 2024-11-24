import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function createCompany(req, res) {
    const { name, email, password } = req.body;
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
            !password ||
            password.length > 255 ||
            password.length < 8 ||
            !passwordPattern.test(password)
        )
            throw new Error("A senha é inválida.");

        const company = await prisma.company.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function loginCompany(req, res) {
    const { email, password } = req.body;
    try {
        const company = await prisma.company.findUnique({
            where: {
                email,
            },
        });
        if (!company) {
            throw new Error("Empresa não encontrada.");
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            company.password
        );
        if (!isPasswordValid) {
            throw new Error("Senha incorreta.");
        }
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getCompanyByEmail(req, res) {
    const { email } = req.params;
    try {
        const company = await prisma.company.findUnique({
            where: {
                email,
            },
        });
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: "Empresa não encontrada." });
    }
}

export async function updateCompany(req, res) {
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

        const company = await prisma.company.update({
            where: {
                email,
            },
            data: updateData,
        });
        res.json(company);
    } catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Empresa não encontrada" });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

export async function deleteCompany(req, res) {
    const { email } = req.params;
    try {
        const company = await prisma.company.delete({
            where: {
                email,
            },
        });
        res.json(company);
    } catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Empresa não encontrada" });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}
