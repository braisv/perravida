const sqlite3 = require('sqlite3')
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

/**
 * Creates sqlite connection with its client 
 */
class SQLiteDb {
  #client = null;
  // static #databaseFilename = ':memory:';
  static #databaseFilename = './perravida.db';

  constructor() {
    this.#client = open({
      filename: SQLiteDb.#databaseFilename,
      driver: sqlite3.Database
    });
  }

  async getClient() {
      return this.#client;
  }
}

module.exports = new SQLiteDb();