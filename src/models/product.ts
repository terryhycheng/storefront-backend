import client from "../database";

export type Product = {
  id: Number;
  name: String;
  price: Number;
  category: String | null;
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

  async show(productId: Number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * FROM products WHERE id=${productId}`;
      const result = await conn.query(sql);
      const product: Product = result.rows[0];
      conn.release();
      return product;
    } catch (error) {
      throw new Error(`Cannot get product by ID: ${error}`);
    }
  }

  //with JWT
  async create(
    name: string,
    price: number,
    category: string | null
  ): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [name, price, category]);
      const new_product: Product = result.rows[0];
      conn.release();
      return new_product;
    } catch (error) {
      throw new Error(`Cannot create product: ${error}`);
    }
  }

  //optional
  async ranking(): Promise<void> {}
}
