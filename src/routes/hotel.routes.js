import express from "express";
import { makeHotelController } from "../factories/prisma/make-hotel-controller.js";
import { fetchNearbyHotels } from "../controllers/nearby-hotel.controller.js";

const hotelRouter = express.Router();
const hotelController = makeHotelController();

hotelRouter.post("/", hotelController.createHotel);

hotelRouter.post("/login", hotelController.loginHotel);

hotelRouter.get("/nearby", fetchNearbyHotels);

hotelRouter.patch("/:placeId", hotelController.updateHotel);

hotelRouter.delete("/:placeId", hotelController.deleteHotel);

hotelRouter.get("/search/:name", hotelController.searchHotelsByName);

hotelRouter.get("/place/:placeId", hotelController.getHotelByPlaceId);

export default hotelRouter;
