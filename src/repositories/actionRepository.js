import BaseRepository from "./baseRepository.js";

class ActionRepository extends BaseRepository {
  constructor() {
    super("src/data/actions.json");
  }

  async getAllUserActions(userId) {
    const data = await this.readData();

    // Check if data is empty
    if (!data || !data.length) {
      return 0;
    }
    return data.filter((action) => action.userId === parseInt(userId)).length;
  }

  async filterUserActions({ key, value }) {
    const data = await this.readData();
    return data.filter((action) => action[key] === value);
  }
}

export default new ActionRepository();
