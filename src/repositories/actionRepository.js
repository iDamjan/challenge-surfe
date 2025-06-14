import BaseRepository from "./baseRepository.js";

class ActionRepository extends BaseRepository {
  constructor() {
    super("src/data/actions.json");
  }

  async getAllUserActions(userId) {
    const data = await this.readData();
    return data.filter((action) => action.userId === parseInt(userId)).length;
  }

  async filterUserActions(key) {}
}

export default new ActionRepository();
