import client from "../database";
import { UpdateProduct } from "../handlers/products";

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
      const sql = "SELECT * FROM products ORDER BY id ASC";
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

  async update(product_id: Number, body: UpdateProduct): Promise<Product> {
    try {
      const { name, price, category } = body;
      const conn = await client.connect();
      const sql = `UPDATE products SET name=$1, price=$2, category=$3 WHERE id = ${product_id} RETURNING *`;
      const result = await conn.query(sql, [name, price, category]);
      const edit_product: Product = result.rows[0];
      conn.release();
      return edit_product;
    } catch (error) {
      throw new Error(`Cannot edit product: ${error}`);
    }
  }

  async remove(product_id: Number): Promise<Product> {
    try {
      const conn = await client.connect();
      const order_products_sql = `DELETE from order_products WHERE product_id = ${product_id} RETURNING *`;
      const products_sql = `DELETE from products WHERE id = ${product_id} RETURNING *`;
      const order_products_result = await conn.query(order_products_sql);
      const result = await conn.query(products_sql);
      result.rows[0].deleted = order_products_result.rows;
      const deleted_product: Product = result.rows[0];
      conn.release();
      return deleted_product;
    } catch (error) {
      throw new Error(`Cannot delete product: ${error}`);
    }
  }

  //optional
  async category(category: String): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT * from products WHERE category = '${category}'`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get products by category: ${error}`);
    }
  }
}
