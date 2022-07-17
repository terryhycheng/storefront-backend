import client from "../database";

export type Order = {
  id: Number;
  user_id: Number;
  state: String;
  items?: Item[];
};

export type Item = {
  id: Number;
  quantity: Number;
  order_id: Number;
  product_id: Number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders ORDER BY id ASC";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get all orders : ${error}`);
    }
  }

  async search(order_id: Number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql_order = `SELECT * FROM orders WHERE id = ${order_id}`;
      const sql_item = `SELECT * FROM order_products WHERE order_id = ${order_id} ORDER BY id ASC`;
      const result = await conn.query(sql_order);
      const items = await conn.query(sql_item);
      conn.release();
      result.rows[0].items = items.rows;
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get order by order id : ${error}`);
    }
  }

  async create(user_id: Number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *`;
      const result = await conn.query(sql, [user_id, "active"]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot get order by user id : ${error}`);
    }
  }

  async addItem(
    order_id: Number,
    product_id: Number,
    quantity: Number
  ): Promise<Item> {
    try {
      const conn = await client.connect();
      const sql = `INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
      const result = await conn.query(sql, [order_id, product_id, quantity]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot add products to order : ${error}`);
    }
  }

  async editItem(
    order_products_id: Number,
    product_id: Number,
    quantity: Number
  ): Promise<Item> {
    try {
      const conn = await client.connect();
      const sql = `UPDATE order_products SET product_id=$1, quantity=$2 WHERE order_products.id=$3  RETURNING *`;
      const result = await conn.query(sql, [
        product_id,
        quantity,
        order_products_id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot edit item in order: ${error}`);
    }
  }

  async removeItem(order_products_id: Number): Promise<Item> {
    try {
      const conn = await client.connect();
      const sql = `DELETE from order_products WHERE order_products.id=$1 RETURNING *`;
      const result = await conn.query(sql, [order_products_id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot edit item in order: ${error}`);
    }
  }

  async remove(order_id: Number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql_items = `DELETE from order_products WHERE order_id = ${order_id} RETURNING *`;
      const sql = `DELETE from orders WHERE id = ${order_id} RETURNING *`;
      const deleted_items = await conn.query(sql_items);
      const result = await conn.query(sql);
      result.rows[0].items = deleted_items.rows;
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Cannot delete order : ${error}`);
    }
  }
}
