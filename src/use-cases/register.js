import { hash } from "bcrypt";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";

export class RegisterUseCase {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute({ name, email, password, companyEmail }) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password: password_hash,
      companyEmail,
    });

    return {
      user,
    };
  }
}
