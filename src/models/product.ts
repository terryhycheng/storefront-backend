import client from "../database";

export type Product = {
  id: Number;
  name: String;
  price: Number;
  category: String;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get products ${error}`);
    }
  }

  async show(): Promise<void> {}

  //with JWT
  async create(): Promise<void> {}

  //optional
  async ranking(): Promise<void> {}
}
