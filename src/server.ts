import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import product_routes from "./handlers/products";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

product_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
