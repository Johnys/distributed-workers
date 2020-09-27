import { createConnection, Connection } from 'typeorm';

export default class ConnectionManager {
  static connection: Connection;

  static async init(): Promise<void> {
    if (!ConnectionManager.connection) {
      ConnectionManager.connection = await createConnection();
      await ConnectionManager.connection.query('CREATE SCHEMA IF NOT EXISTS workers');
      await ConnectionManager.connection.synchronize();
    }
  }

  static async close(): Promise<void> {
    await ConnectionManager.connection.close();
  }
}
