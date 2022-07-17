import express, { Request, Response, RequestHandler } from "express";
import { Order, OrderStore } from "../models/order";
import { verifyAuthToken } from "./verify";

const store = new OrderStore();

//users ROUTES
export const order_routes = (app: express.Application) => {
  app.get("/orders", verifyAuthToken, index);
  app.get("/order/:order_id", verifyAuthToken, search);
  app.post("/order/create/:user_id", verifyAuthToken, create);
  app.post("/order/:order_id", verifyAuthToken, addItem);
  app.put("/order/item/:order_products_id", verifyAuthToken, editItem);
  app.delete("/order/:order_id", verifyAuthToken, remove);
  app.delete("/order/item/:order_products_id", verifyAuthToken, removeItem);
};

const index = async (req: Request, res: Response): Promise<void> => {
  const orders: Order[] = await store.index();
  res.json(orders);
};

const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id = parseInt(req.params.order_id);
    const order: Order = await store.search(order_id);
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.params.user_id);
    const new_order: Order = await store.create(user_id);
    res
      .status(200)
      .send({ message: `Order was created successfully!`, order: new_order });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const addItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id: Number = parseInt(req.params.order_id);
    const product_id: Number = parseInt(req.body.product_id);
    const quantity: Number = parseInt(req.body.quantity);
    const updated_order: Order = await store.addItem(
      order_id,
      product_id,
      quantity
    );
    res.status(200).send(updated_order);
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const editItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_products_id: Number = parseInt(req.params.order_products_id);
    const product_id: Number = parseInt(req.body.product_id);
    const quantity: Number = parseInt(req.body.quantity);
    const updated_item = await store.editItem(
      order_products_id,
      product_id,
      quantity
    );
    updated_item
      ? res
          .status(200)
          .send({ message: `Item updated!`, updated: updated_item })
      : res.status(404).send({ message: `Item was not found.` });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_id: Number = parseInt(req.params.order_id);
    const deleted_order: Order = await store.remove(order_id);
    res
      .status(200)
      .send({ message: `Order was deleted!`, deleted: deleted_order });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const removeItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const order_products_id: Number = parseInt(req.params.order_products_id);
    const deleted_item = await store.removeItem(order_products_id);
    deleted_item
      ? res.status(200).send({ message: `Item deleted!`, item: deleted_item })
      : res.status(404).send({ message: `Item was not found.` });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};
