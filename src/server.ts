import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import product_routes from "./handlers/products";
import user_routes from "./handlers/users";
import { order_routes } from "./handlers/orders";

const app: express.Application = express();
const port: number = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req: Request, res: Response) {
  res.send({ message: "Hello World!" });
});

product_routes(app);
user_routes(app);
order_routes(app);

app.listen(port, function () {
  console.log(`starting app on: http://localhost:${port}`);
});

export default app;
