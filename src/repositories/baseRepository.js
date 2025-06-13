import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

class BaseRepository {
  constructor(filePath) {
    this.filePath = path.join(process.cwd(), filePath);
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Error reading data: ${error.message}`);
    }
  }

  async writeData(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error writing data: ${error.message}`);
    }
  }

  async findById(id) {
    const data = await this.readData();
    return data.find((item) => item.id === parseInt(id));
  }

  async findAll() {
    return await this.readData();
  }

  async create(item) {
    const data = await this.readData();
    data.push(item);
    await this.writeData(data);
    return item;
  }

  async update(id, updatedItem) {
    const data = await this.readData();
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) return null;

    data[index] = { ...data[index], ...updatedItem };
    await this.writeData(data);
    return data[index];
  }

  async delete(id) {
    const data = await this.readData();
    const filteredData = data.filter((item) => item.id !== id);
    if (filteredData.length === data.length) return null;

    await this.writeData(filteredData);
    return true;
  }
}

export default BaseRepository;
