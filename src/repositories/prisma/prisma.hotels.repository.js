import { prisma } from "../../services/prisma.service.js";

export class PrismaHotelsRepository {
  async findById(id) {
    try {
      const hotel = await prisma.hotel.findUnique({
        where: { id },
      });
      return hotel;
    } catch (error) {
      console.error("Error finding hotel by ID:", error);
      throw new Error("Could not find hotel by ID");
    }
  }

  async findByName(name) {
    try {
      const hotel = await prisma.hotel.findFirst({
        where: { name },
      });
      return hotel;
    } catch (error) {
      console.error("Error finding hotel by name:", error);
      throw new Error("Could not find hotel by name");
    }
  }

  async searchName(name, page) {
    try {
      const hotel = await prisma.hotel.findFirst({
        where: {
          name: {
            contains: name,
          },
        },
        take: 20,
        skip: (page - 1) * 20,
      });
      return hotel;
    } catch (error) {
      console.error("Error finding hotel by name:", error);
      throw new Error("Could not find hotel by name");
    }
  }

  async findAll() {
    try {
      const hotels = await prisma.hotel.findMany();
      return hotels;
    } catch (error) {
      console.error("Error finding all hotels:", error);
      throw new Error("Could not find hotels");
    }
  }

  async create(data) {
    try {
      const hotel = await prisma.hotel.create({
        data,
      });
      return hotel;
    } catch (error) {
      console.error("Error creating hotel:", error);
      throw new Error("Could not create hotel");
    }
  }

  async update(id, data) {
    try {
      const updatedHotel = await prisma.hotel.update({
        where: { id },
        data,
      });
      return updatedHotel;
    } catch (error) {
      console.error("Error updating hotel:", error);
      throw new Error("Could not update hotel");
    }
  }

  async delete(id) {
    try {
      const deletedHotel = await prisma.hotel.delete({
        where: { id },
      });
      return deletedHotel;
    } catch (error) {
      console.error("Error deleting hotel:", error);
      throw new Error("Could not delete hotel");
    }
  }

  async findManyNearby({ latitude, longitude, radius = 10 }) {
    try {
      const hotels = await prisma.$queryRaw`
        SELECT 
          *,
          (
            6371 * acos(
              cos(radians(${latitude})) * 
              cos(radians(latitude::float)) * 
              cos(radians(longitude::float) - radians(${longitude})) + 
              sin(radians(${latitude})) * 
              sin(radians(latitude::float))
            )
          ) as distance
        FROM "Hotel"
        WHERE (
          6371 * acos(
            cos(radians(${latitude})) * 
            cos(radians(latitude::float)) * 
            cos(radians(longitude::float) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(latitude::float))
          )
        ) <= ${radius}
        ORDER BY distance
        LIMIT 50
      `;

      return hotels;
    } catch (error) {
      console.error("Error finding hotels nearby:", error);
      throw new Error("Could not find hotels nearby");
    }
  }
}
