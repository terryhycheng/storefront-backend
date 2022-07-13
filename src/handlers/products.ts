import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";

const store = new ProductStore();

//ROUTES
const product_routes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  //GET by category
  app.post("/products", create);
  app.get("/products/ranking", ranking);
};

const index = async (req: Request, res: Response): Promise<void> => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response): Promise<void> => {
  const productId: Number = parseInt(req.params.id);
  const product = await store.show(productId);
  product
    ? res.json(product)
    : res.status(400).send({ message: "No product found." });
};

const create = async (req: Request, res: Response): Promise<void> => {
  const name: string = req.body.name;
  const price: number = req.body.price;
  const category: string | null = req.body.category;

  try {
    const createdItem: Product = await store.create(name, price, category);
    res.json(createdItem);
  } catch (error) {
    res.status(400);
    res.send({ message: `${error}` });
  }
};

const ranking = async (req: Request, res: Response): Promise<void> => {
  const ranking = await store.ranking();
  res.json(ranking);
};

export default product_routes;
