import express, { Request, Response, RequestHandler } from "express";
import { Product, ProductStore } from "../models/product";
import jwt from "jsonwebtoken";

const store = new ProductStore();
const token_secret = process.env.TOKEN_SECRET;

//ROUTES
const product_routes = (app: express.Application) => {
  app.get("/products", verifyAuthToken, index);
  app.get("/products/:id", verifyAuthToken, show);
  //GET by category
  app.post("/products", verifyAuthToken, create);
  app.get("/products/ranking", ranking);
  app.put("/products/:id", verifyAuthToken, update);
  app.delete("/products/:id", verifyAuthToken, destroy);
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

const update = async (req: Request, res: Response): Promise<void> => {
  const update = await store.update();
  res.json(update);
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  const destroy = await store.destroy();
  res.json(destroy);
};

const ranking = async (req: Request, res: Response): Promise<void> => {
  const ranking = await store.ranking();
  res.json(ranking);
};

//Custome Middleware
const verifyAuthToken: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      token_secret
        ? jwt.verify(token, token_secret)
        : new Error("Token secret is missing in environment.");
      next();
    } else {
      throw new Error("jwt must be provided.");
    }
  } catch (error) {
    res.status(401).send(`Access denied. Invalid token. ${error}`);
    return;
  }
};

export default product_routes;
