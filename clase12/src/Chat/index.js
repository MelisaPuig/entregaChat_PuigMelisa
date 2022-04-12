const fs = require("fs");
const path = require("path");

const BASE_FILE_PATH = path.join(__dirname, "chats.txt");
const CHATS_MAX_MESSAGES = 1000;

class Chat {
  constructor() {
    this.filePath = BASE_FILE_PATH;
  }

  async getAll() {
    try {
      const chats = await this._getChatsFromFile();
      return chats;
    } catch (error) {
      throw error;
    }
  }

  async addMessage(mail, message) {
    try {
      const date = new Date();
      const newMessage = { mail, message, date };
      let chats = await this._getChatsFromFile();
      chats.push(newMessage);
      if (chats.length > CHATS_MAX_MESSAGES) {
        chats = chats.slice(-CHATS_MAX_MESSAGES);
      }
      await this._saveChatsToFile(chats);
      return newMessage;
    } catch (error) {
      throw new Error(
        `Ha ocurrido un error agregando el contenido: ${error.description}`
      );
    }
  }

  /**
   * PRIVATE METHODS.
   */

  async _getChatsFromFile() {
    try {
      const fileExists = fs.existsSync(this.filePath);
      if (!fileExists) {
        return [];
      }
      const fileContent = await fs.promises.readFile(this.filePath, "utf8");
      const chats = JSON.parse(fileContent);
      return chats;
    } catch (error) {
      throw error;
    }
  }

  async _saveChatsToFile(chats) {
    try {
      const JSONChats = JSON.stringify(chats);
      const fileExists = fs.existsSync(this.filePath);
      if (fileExists) {
        await fs.promises.unlink(this.filePath);
      }
      await fs.promises.writeFile(this.filePath, JSONChats, "utf-8");
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Chat;
