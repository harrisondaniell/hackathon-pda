import express from "express";
import {
  createReservation,
  getReservationsByHotelId,
  getReservationsByUserEmail,
  deleteReservation,
  updateReservation,
} from "../controllers/reservation.controller.js";

const reservationRouter = express.Router();

reservationRouter.get("/user/:email", getReservationsByUserEmail);
reservationRouter.get("/hotel/:hotelId", getReservationsByHotelId);
reservationRouter.post("/", createReservation);
reservationRouter.patch("/:id", updateReservation);
reservationRouter.delete("/:id", deleteReservation);

export default reservationRouter;
