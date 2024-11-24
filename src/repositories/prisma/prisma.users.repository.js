import { prisma } from "../../services/prisma.js";

export class PrismaUsersRepository {
  async findByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Could not find user by email");
    }
  }

  async create(data) {
    try {
      const user = await prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Could not create user");
    }
  }

  async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {}
  }
}
