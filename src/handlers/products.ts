import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";

const store = new ProductStore();

//ROUTES
const product_routes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", create);
  app.get("/products/ranking", ranking);
};

const index = async (req: Request, res: Response): Promise<void> => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response): Promise<void> => {
  const product = await store.show();
  res.json(product);
};

const create = async (req: Request, res: Response): Promise<void> => {
  const createdItem = await store.create();
  res.json(createdItem);
};

const ranking = async (req: Request, res: Response): Promise<void> => {
  const ranking = await store.ranking();
  res.json(ranking);
};

export default product_routes;
