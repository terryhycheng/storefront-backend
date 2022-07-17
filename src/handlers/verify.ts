import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const token_secret = process.env.TOKEN_SECRET;

export const verifyAuthToken: RequestHandler = (req, res, next) => {
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
