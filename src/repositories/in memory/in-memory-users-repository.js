export class InMemoryUsersRepository {
  constructor() {
    this.items = [];
  }
  async findByEmail(email) {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(data) {
    const user = {
      id: "user-1",
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      creted_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
