import bcrypt from "bcrypt";
import z from "zod";

const userSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
  companyEmail: z.string(),
});

export class UserController {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async createUser(req, res) {
    try {
      const userData = userSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await this.usersRepository.create({
        ...userData,
        password: hashedPassword,
      });

      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async getUserByEmail(req, res) {
    try {
      const user = await this.usersRepository.findByEmail(req.params.email);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUsersByCompanyEmail(req, res) {
    try {
      const users = await this.usersRepository.findManyByCompanyEmail(
        req.params.companyEmail
      );
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: "Usuários não encontrados" });
    }
  }

  async updateUser(req, res) {
    try {
      const updateSchema = userSchema.partial();
      const updateData = updateSchema.parse(req.body);

      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await this.usersRepository.update(
        req.params.email,
        updateData
      );
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const user = await this.usersRepository.delete(req.params.email);
      res.json(user);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.status(400).json({ error: error.message });
    }
  }
}
