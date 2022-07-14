import express, { Request, Response, RequestHandler } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";

const store = new UserStore();
const token_secret = process.env.TOKEN_SECRET;

//users ROUTES
const user_routes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", register);
};

//Require a JWT and show all users
const index = async (req: Request, res: Response): Promise<void> => {
  const users: User[] = await store.index();
  res.json(users);
};

//Require a JWT and show the item WHERE id = *
const show = async (req: Request, res: Response): Promise<void> => {
  const userId: Number = parseInt(req.params.id);
  const user: User = await store.show(userId);
  user ? res.json(user) : res.status(400).send({ message: "No user found." });
};

//Register and return a JWT
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const username: String = req.body.username;
    const firstName: String = req.body.first_name;
    const lastName: String = req.body.last_name;
    const password: String = req.body.password;
    const user: User = await store.register(
      username,
      firstName,
      lastName,
      password
    );
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

export default user_routes;
