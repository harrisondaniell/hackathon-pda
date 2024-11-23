import express from "express";
import {
  createHotel,
  loginHotel,
  getHotelByPlaceId,
  searchHotelsByName,
  updateHotel,
  deleteHotel,
} from "../controllers/hotel.controller.js";

const hotelRouter = express.Router();

hotelRouter.get("/search/:name", searchHotelsByName);
hotelRouter.get("/place/:placeId", getHotelByPlaceId);
hotelRouter.post("/", createHotel);
hotelRouter.post("/login", loginHotel);
hotelRouter.patch("/:placeId", updateHotel);
hotelRouter.delete("/:placeId", deleteHotel);

export default hotelRouter;
