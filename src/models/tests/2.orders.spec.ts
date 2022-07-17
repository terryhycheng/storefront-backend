import { Item, Order, OrderStore } from "../order";
import { UserStore } from "../user";
import { ProductStore } from "../product";

const user_store = new UserStore();
const product_store = new ProductStore();
const store = new OrderStore();

describe("Order Model: Checking Methods", () => {
  it("should have an index()", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a search()", () => {
    expect(store.search).toBeDefined();
  });

  it("should have a create()", () => {
    expect(store.create).toBeDefined();
  });

  it("should have an addItem()", () => {
    expect(store.addItem).toBeDefined();
  });

  it("should have an editItem()", () => {
    expect(store.editItem).toBeDefined();
  });

  it("should have a remove()", () => {
    expect(store.remove).toBeDefined();
  });

  it("should have a removeItem()", () => {
    expect(store.removeItem).toBeDefined();
  });
});

describe("Order Model: Testing Functionalities of Methods", () => {
  const test_user = {
    username: "test2",
    first_name: "first",
    last_name: "last",
    password: "123456",
  };

  beforeAll(async () => {
    await user_store.register(test_user);
    await product_store.create("water", 15, "drinks");
  });

  afterAll(async () => {
    await user_store.remove(2);
    await product_store.remove(1);
  });

  it("index() should return a list of orders", async () => {
    const result: Order[] = await store.index();
    expect(result).toEqual([]);
  });

  it("create() should create a new order", async () => {
    const result: Order = await store.create(2);
    expect(result.user_id).toEqual(2);
  });

  it("search() should return a certain order", async () => {
    const result: Order = await store.search(1);
    expect(result.user_id).toEqual(2);
  });

  it("addItem() should create a new item in certain order", async () => {
    const result: Item = await store.addItem(1, 1, 10);
    expect(result.quantity).toEqual(10);
  });

  it("editItem() should edit a certain item", async () => {
    const result: Item = await store.editItem(1, 1, 20);
    expect(result.quantity).toEqual(20);
  });

  it("removeItem() should remove a certain item", async () => {
    const result: Item = await store.removeItem(1);
    expect(result.id).toEqual(1);
  });

  it("remove() should remove a certain order", async () => {
    const result: Order = await store.remove(1);
    expect(result.user_id).toEqual(2);
  });
});
