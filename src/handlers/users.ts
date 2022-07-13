import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";

const store = new UserStore();

//ROUTES
const user_routes = (app: express.Application) => {
  app.get("/users", index);
  app.get("/users/:id", show);
  app.post("/users", register);
};

//with JWT
const index = async (req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

//with JWT
const show = async (req: Request, res: Response) => {
  const userId: Number = parseInt(req.params.id);
  const user = await store.show(userId);
  user ? res.json(user) : res.status(400).send({ message: "No user found." });
};

//with JWT
const register = async (req: Request, res: Response) => {
  try {
    const firstName: String = req.body.first_name;
    const lastName: String = req.body.last_name;
    const password: String = req.body.password;
    const user = await store.register(firstName, lastName, password);
    res.json(user);
  } catch (error) {
    res.status(400).send({ message: `${error}` });
  }
};

export default user_routes;
