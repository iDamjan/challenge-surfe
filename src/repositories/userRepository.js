import BaseRepository from "./baseRepository.js";

class UserRepository extends BaseRepository {
  constructor() {
    super("src/data/users.json");
  }

  // User-specific methods
  async findByEmail(email) {
    const data = await this.readData();
    return data.find((user) => user.email === email);
  }

  async findByUsername(username) {
    const data = await this.readData();
    return data.find((user) => user.username === username);
  }
}

export default new UserRepository();
