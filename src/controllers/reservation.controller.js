import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createReservation(req, res) {
  const { email, placeId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: placeId,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    if (!hotel) {
      return res.status(404).json({ error: "Hotel não encontrado" });
    }
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        hotelId: hotel.id,
      },
      d,
    });
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getReservationsByUserEmail(req, res) {
  const { email } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: user.id,
      },
    });
    res.json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getReservationsByHotelId(req, res) {
  const { hotelId } = req.params;
  try {
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });
    if (!hotel) {
      return res.status(404).json({ error: "Hotel não encontrado" });
    }
    const reservations = await prisma.reservation.findMany({
      where: {
        hotelId,
      },
    });
    res.json(reservations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateReservation(req, res) {
  const { id } = req.params;
  const { email, placeId } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    const hotel = await prisma.hotel.findUnique({
      where: {
        id: placeId,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    if (!hotel) {
      return res.status(404).json({ error: "Hotel não encontrado" });
    }
    const reservation = await prisma.reservation.update({
      where: {
        id: Number(id),
      },
      data: {
        userId: user.id,
        hotelId: hotel.id,
      },
    });
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteReservation(req, res) {
  const { id } = req.params;
  try {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!reservation) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }
    await prisma.reservation.delete({
      where: {
        id: Number(id),
      },
    });
    res.json({ message: "Reserva deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
