import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../server";

dotenv.config();

const token = `Beara ${process.env.TOKEN}`;
const request = supertest(app);

describe("Testing '/' endpoint", () => {
  it("Root endpoint should return 'Hello World!'", async () => {
    const response = await request.get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello World!");
  });
});

describe("Testing '/user' endpoints", () => {
  it("GET '/users' should be running.", async () => {
    const response = await request.get("/users").set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("GET '/user/:id' should be running.", async () => {
    const response = await request.get("/user/1").set("Authorization", token);
    expect(response.status).toBe(400);
  });

  it("GET '/user/:id/orders' should be running.", async () => {
    const response = await request
      .get("/user/1/orders")
      .set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("PUT '/user/:id' should be running.", async () => {
    const response = await request.put("/user/1").set("Authorization", token);
    expect(response.status).toBe(200);
  });

  it("DELETE '/user/:id' should be running.", async () => {
    const response = await request
      .delete("/user/1")
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });

  it("POST '/user' should be running.", async () => {
    const response = await request.post("/user");
    expect(response.status).toBe(400);
  });
});

describe("Testing '/order' endpoints", () => {
  it("GET '/orders' should be running.", async () => {
    const response = await request.get("/orders").set("Authorization", token);
    expect(response.status).toBe(200);
  });
  it("POST '/order/create/:user_id' should be running.", async () => {
    const response = await request
      .get("/order/create/1")
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });
  it("GET '/order/:order_id' should be running.", async () => {
    const response = await request.get("/order/1").set("Authorization", token);
    expect(response.status).toBe(400);
  });
  it("POST '/order/:order_id' should be running.", async () => {
    const response = await request.get("/orders/1").set("Authorization", token);
    expect(response.status).toBe(404);
  });
  it("PUT '/order/item/:order_products_id' should be running.", async () => {
    const response = await request
      .get("/orders/item/1")
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });
  it("DELETE '/order/item/:order_products_id' should be running.", async () => {
    const response = await request
      .get("/order/item/1")
      .set("Authorization", token);
    expect(response.status).toBe(404);
  });
  it("DELETE '/order/:order_id' should be running.", async () => {
    const response = await request.get("/orders/1").set("Authorization", token);
    expect(response.status).toBe(404);
  });
});

describe("Testing '/product' endpoints", () => {
  it("GET '/products' should be running.", async () => {
    const response = await request.get("/products");
    expect(response.status).toBe(200);
  });
  it("GET '/product/:id' should be running.", async () => {
    const response = await request.get("/product/1");
    expect(response.status).toBe(400);
  });
  it("POST '/product' should be running.", async () => {
    const response = await request.post("/product");
    expect(response.status).toBe(401);
  });
  it("GET '/product/category/:category' should be running.", async () => {
    const response = await request.get("/product/category/drinks");
    expect(response.status).toBe(401);
  });
  it("PUT '/product/:id' should be running.", async () => {
    const response = await request.put("/product/1");
    expect(response.status).toBe(401);
  });
  it("DELETE '/product/:id' should be running.", async () => {
    const response = await request.delete("/product/1");
    expect(response.status).toBe(401);
  });
});
