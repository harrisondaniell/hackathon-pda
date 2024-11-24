import bcrypt from "bcrypt";
import { classifyEstablishment } from "../services/classification.service.js";

export class HotelController {
  constructor(hotelsRepository) {
    this.hotelsRepository = hotelsRepository;
  }

  async createHotel(req, res) {
    const data = req.body;

    try {
      data.password = await bcrypt.hash(password, 10);
      data.category = await classifyEstablishment(data.name, data.description);

      const hotel = await this.hotelsRepository.create(data);

      return res.status(201).json(hotel);
    } catch (error) {
      if (error.message === "Failed to classify establishment") {
        return res.status(502).json({
          error: "Failed to classify the hotel. Please try again later.",
        });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  async loginHotel(req, res) {
    const { placeId, password } = req.body;

    try {
      const hotel = await this.hotelsRepository.findByPlaceId(placeId);

      if (!hotel) {
        return res.status(404).json({ error: "Hotel não encontrado" });
      }

      const isPasswordValid = await bcrypt.compare(password, hotel.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Senha incorreta." });
      }

      return res.json(hotel);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getHotelByPlaceId(req, res) {
    const { placeId } = req.params;

    try {
      const hotel = await this.hotelsRepository.findByPlaceId(placeId);

      if (!hotel) {
        return res.status(404).json({ error: "Hotel não encontrado." });
      }

      return res.json(hotel);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async searchHotelsByName(req, res) {
    const { name } = req.params;
    const page = parseInt(req.query.page) || 1;

    try {
      const hotels = await this.hotelsRepository.searchByName(name, page);

      if (!hotels || hotels.length === 0) {
        return res.status(404).json({ error: "Nenhum hotel encontrado." });
      }

      return res.json(hotels);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateHotel(req, res) {
    const updateData = req.body;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    try {
      const placeId = updateData.placeId;
      const hotel = await this.hotelsRepository.update(placeId, updateData);

      if (!hotel) {
        return res.status(404).json({ error: "Hotel não encontrado." });
      }

      return res.json(hotel);
    } catch (error) {
      return res.status(400).json({ error: "Erro ao atualizar dados." });
    }
  }

  async deleteHotel(req, res) {
    const { placeId } = req.params;

    try {
      const hotel = await this.hotelsRepository.delete(placeId);

      if (!hotel) {
        return res.status(404).json({ error: "Hotel não encontrado." });
      }

      return res.json(hotel);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Hotel não encontrado." });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}
