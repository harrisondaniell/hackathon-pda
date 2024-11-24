import { HotelController } from "../../controllers/hotel.controller.js";
import { PrismaHotelsRepository } from "../../repositories/prisma/prisma.hotels.repository.js";

export function makeHotelController() {
  const hotelsRepository = new PrismaHotelsRepository();
  return new HotelController(hotelsRepository);
}
