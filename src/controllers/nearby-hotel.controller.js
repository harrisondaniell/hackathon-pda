import { FetchNearbyHotelsUseCase } from "../use-cases/fetch-nearby-hotels.js";
import z from "zod";
export async function fetchNearbyHotels(req, res) {
  const nearbyHotelsQuerySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90, {}),
    longitude: z.number().refine((value) => Math.abs(value) <= 180, {}),
  });

  try {
    const { latitude, longitude } = nearbyHotelsQuerySchema.parse(req.body);
    const fetchNearbyHotelsUseCase = new FetchNearbyHotelsUseCase();
    const { hotels } = await fetchNearbyHotelsUseCase.execute({
      latitude,
      longitude,
    });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
