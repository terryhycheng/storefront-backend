import client from "../database";

export type User = {
  id: Number;
  firstName: String;
  lastName: String;
  password: String;
};

export class UserStore {
  //with JWT
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get products ${error}`);
    }
  }

  //with JWT
  async show(): Promise<void> {}

  //with JWT
  async create(): Promise<void> {}
}
