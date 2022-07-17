import express, { Request, Response, RequestHandler } from "express";
import { User, UserStore } from "../models/user";
import { Order } from "../models/order";
import jwt from "jsonwebtoken";
import { verifyAuthToken, token_secret } from "./verify";

const store = new UserStore();

export type UserBody = {
  username: String;
  first_name: String;
  last_name: String;
  password: String;
};

//users ROUTES
const user_routes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/user/:id", verifyAuthToken, show);
  app.get("/user/:id/orders", verifyAuthToken, getOrders);
  app.put("/user/:id", verifyAuthToken, edit);
  app.delete("/user/:id", verifyAuthToken, remove);
  app.post("/user", register);
};

//Show all users
const index = async (req: Request, res: Response): Promise<void> => {
  const users: User[] = await store.index();
  res.json(users);
};

//Show the item WHERE id = *
const show = async (req: Request, res: Response): Promise<void> => {
  const userId: Number = parseInt(req.params.id);
  const user: User = await store.show(userId);
  user ? res.json(user) : res.status(400).send({ message: "No user found." });
};

//Register and return a JWT
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: UserBody = req.body;
    const user: User = await store.register(body);
    if (token_secret) {
      const token: String = jwt.sign({ user: user }, token_secret);
      res.json(token);
    } else {
      throw new Error("Token secret is missing in environment.");
    }
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

const edit = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: UserBody = req.body;
    const user_id: Number = parseInt(req.params.id);
    const updated_user: User = await store.edit(user_id, body);
    res
      .status(200)
      .send({ message: "User info was updated!", updated: updated_user });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

//Delete a user with its ID
const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.params.id);
    const deleted_user: User = await store.remove(user_id);
    deleted_user
      ? res.send({
          message: `User with ID ( ${user_id} ) was deleted!`,
          deleted: deleted_user,
        })
      : res.status(404).send({
          message: `User with ID ( ${user_id} ) was not found.`,
        });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

//Get orders with user ID
const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = parseInt(req.params.id);
    const orders: Order[] = await store.getOrders(user_id);
    orders.length
      ? res.json(orders)
      : res.send({ message: "No order was found." });
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

export default user_routes;
