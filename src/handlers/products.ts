import express, { Request, Response, RequestHandler } from "express";
import { Product, ProductStore } from "../models/product";
import { verifyAuthToken } from "./verify";

const store = new ProductStore();

export type UpdateProduct = {
  name: String;
  price: Number;
  category: String;
};

//ROUTES
const product_routes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/product/:id", show);
  app.post("/product", verifyAuthToken, create);
  app.get("/product/category/:category", verifyAuthToken, category);
  app.put("/product/:id", verifyAuthToken, update);
  app.delete("/product/:id", verifyAuthToken, remove);
};

const index = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId: Number = parseInt(req.params.id);
    const product = await store.show(productId);
    product
      ? res.json(product)
      : res.status(400).send({ message: "No product found." });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  const name: string = req.body.name;
  const price: number = req.body.price;
  const category: string | null = req.body.category;

  try {
    const createdItem: Product = await store.create(name, price, category);
    res.json(createdItem);
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const product_id: Number = parseInt(req.params.id);
    const body: UpdateProduct = req.body;
    const updated_product = await store.update(product_id, body);
    res.send({ message: "Product was updated!", item: updated_product });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const product_id: Number = parseInt(req.params.id);
    const deteled_product: Product = await store.remove(product_id);
    deteled_product
      ? res
          .status(200)
          .send({ message: "Product was deleted!", item: deteled_product })
      : res.status(404).send({ message: "Product not found" });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const category = async (req: Request, res: Response): Promise<void> => {
  try {
    const category: String = req.params.category;
    const products: Product[] = await store.category(category);
    products.length
      ? res.status(200).send(products)
      : res
          .status(404)
          .send({ message: `No product is found with category '${category}'` });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

export default product_routes;
