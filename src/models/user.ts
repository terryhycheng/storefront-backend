import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const salt = process.env.SALT_ROUNDS || "12";

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
  async show(userId: Number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM users WHERE id=${userId}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get products ${error}`);
    }
  }

  //with JWT
  async register(
    username: String,
    firstName: String,
    lastName: String,
    password: String
  ): Promise<User> {
    try {
      const hash = await bcrypt.hash(password + `${pepper}`, parseInt(salt));
      const conn = await client.connect();
      const sql =
        "INSERT INTO users(username, firstName, lastName, password) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = await client.query(sql, [
        username,
        firstName,
        lastName,
        hash,
      ]);
      const user: User = result.rows[0];
      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Unable to create user ( ${username} ): ${error}`);
    }
  }
}
