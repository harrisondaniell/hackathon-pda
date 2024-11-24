import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { classifyEstablishment } from "../services/classification.service.js";

const prisma = new PrismaClient();

export async function createHotel(req, res) {
    const {
        name,
        stars,
        latitude,
        longitude,
        description,
        address,
        district,
        city,
        state,
        country,
        placeId,
        password,
        thumb,
        images,
        amenities,
        pois,
        reviews,
        cnpj,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const { category } = await classifyEstablishment(name, description);

        const hotel = await prisma.hotel.create({
            data: {
                name,
                stars,
                latitude,
                longitude,
                description,
                address,
                district,
                city,
                state,
                country,
                placeId,
                password: hashedPassword,
                thumb,
                images,
                amenities,
                pois,
                reviews,
                cnpj,
                category,
            },
        });
        res.json(hotel);
    } catch (error) {
        if (error.message === "Failed to classify establishment") {
            return res.status(502).json({
                error: "Failed to classify the hotel. Please try again later.",
            });
        }

        res.status(400).json({ error: error.message });
    }
}

export async function loginHotel(req, res) {
    const { placeId, password } = req.body;
    try {
        const hotel = await prisma.hotel.findUnique({
            where: {
                placeId,
            },
        });
        if (!hotel) {
            throw new Error("Hotel não encontrado");
        }
        const isPasswordValid = await bcrypt.compare(password, hotel.password);
        if (!isPasswordValid) {
            throw new Error("Senha incorreta.");
        }
        res.json(hotel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function getHotelByPlaceId(req, res) {
    const { placeId } = req.params;
    try {
        const hotel = await prisma.hotel.findUnique({
            where: {
                placeId,
            },
        });
        res.json(hotel);
    } catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Hotel não encontrado." });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

export async function searchHotelsByName(req, res) {
    const { name } = req.params;
    try {
        const hotels = await prisma.hotel.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            },
        });
        res.json(hotels);
    } catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Hotel não encontrado." });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}

export async function updateHotel(req, res) {
    const {
        name,
        stars,
        latitude,
        longitude,
        description,
        address,
        district,
        city,
        state,
        country,
        placeId,
        password,
        thumb,
        images,
        amenities,
        pois,
        reviews,
        cnpj,
    } = req.body;
    const updateData = {};

    if (name) {
        updateData.name = name;
    }
    if (stars) {
        updateData.stars = stars;
    }
    if (latitude) {
        updateData.latitude = latitude;
    }
    if (longitude) {
        updateData.longitude = longitude;
    }
    if (description) {
        updateData.description = description;
    }
    if (address) {
        updateData.address = address;
    }
    if (district) {
        updateData.district = district;
    }
    if (city) {
        updateData.city = city;
    }
    if (state) {
        updateData.state = state;
    }
    if (country) {
        updateData.country = country;
    }
    if (placeId) {
        updateData.placeId = placeId;
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }
    if (thumb) {
        updateData.thumb = thumb;
    }
    if (images) {
        updateData.images = images;
    }
    if (amenities) {
        updateData.amenities = amenities;
    }
    if (pois) {
        updateData.pois = pois;
    }
    if (reviews) {
        updateData.reviews = reviews;
    }
    if (cnpj) {
        updateData.cnpj = cnpj;
    }

    try {
        const hotel = await prisma.hotel.update({
            where: {
                placeId,
            },
            data: updateData,
        });
        res.json(hotel);
    } catch (error) {
        res.status(400).json({ error: "Erro ao atualizar dados." });
    }
}

export async function deleteHotel(req, res) {
    const { placeId } = req.params;
    try {
        const hotel = await prisma.hotel.delete({
            where: {
                placeId,
            },
        });
        res.json(hotel);
    } catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Hotel não encontrado." });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
}
