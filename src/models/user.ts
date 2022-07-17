import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Order } from "./order";
import { UserBody } from "../handlers/users";

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const salt = process.env.SALT_ROUNDS || "12";

export type User = {
  id: Number;
  username: String;
  firstname: String;
  lastname: String;
  password: String;
};

export class UserStore {
  //with JWT
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users ORDER BY id ASC";
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
  async register(body: UserBody): Promise<User> {
    const { username, first_name, last_name, password } = body;
    try {
      const hash = await bcrypt.hash(password + `${pepper}`, parseInt(salt));
      const conn = await client.connect();
      const sql =
        "INSERT INTO users(username, firstName, lastName, password) VALUES ($1, $2, $3, $4) RETURNING *";
      const result = await client.query(sql, [
        username,
        first_name,
        last_name,
        hash,
      ]);
      const user: User = result.rows[0];
      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Unable to create user ( ${username} ): ${error}`);
    }
  }

  async getOrders(user_id: Number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT orders.id, orders.status from users INNER JOIN orders on users.id = orders.user_id WHERE users.id = ${user_id}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get orders by user id ${error}`);
    }
  }

  async remove(user_id: Number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = `DELETE from users WHERE users.id = ${user_id} RETURNING *`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get orders by user id ${error}`);
    }
  }

  async edit(user_id: Number, body: UserBody): Promise<User> {
    const { username, first_name, last_name, password } = body;
    const hash = await bcrypt.hash(password + `${pepper}`, parseInt(salt));
    try {
      const conn = await client.connect();
      const sql = `UPDATE users SET username=$1, firstName=$2, lastName=$3, password=$4 WHERE users.id = ${user_id} RETURNING *`;
      const result = await conn.query(sql, [
        username,
        first_name,
        last_name,
        hash,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get orders by user id ${error}`);
    }
  }
}
