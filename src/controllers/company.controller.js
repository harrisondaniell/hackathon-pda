import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createCompany(req, res) {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
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
            throw new Error("Company not found");
        }
        const isPasswordValid = await bcrypt.compare(
            password,
            company.password
        );
        if (!isPasswordValid) {
            throw new Error("Invalid password");
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
        res.status(400).json({ error: error.message });
    }
}

export async function updateCompany(req, res) {
    const { name, email, password } = req.body;
    const updateData = {};

    if (name) {
        updateData.name = name;
    }

    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }

    try {
        const company = await prisma.company.update({
            where: {
                email,
            },
            data: updateData,
        });
        res.json(company);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        res.status(400).json({ error: error.message });
    }
}
