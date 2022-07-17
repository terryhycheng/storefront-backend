import { Product, ProductStore } from "../product";

const store = new ProductStore();

describe("Product Model: Checking Methods", () => {
  it("should have an index()", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show()", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create()", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a category()", () => {
    expect(store.category).toBeDefined();
  });

  it("should have an update()", () => {
    expect(store.update).toBeDefined();
  });

  it("should have a remove()", () => {
    expect(store.remove).toBeDefined();
  });
});

describe("Product Model: Testing Functionalities of Methods", () => {
  const test_product = {
    name: "milk",
    price: 35,
    category: "drinks",
  };

  const test_edit_product = {
    name: "milk",
    price: 25,
    category: "drinks",
  };

  it("index() should return a list of Products", async () => {
    const result: Product[] = await store.index();
    expect(result).toEqual([]);
  });

  it("create() should return a new product", async () => {
    const { name, price, category } = test_product;
    const result: Product = await store.create(name, price, category);
    expect(result.name).toEqual("milk");
  });

  it("show() should return a certain product", async () => {
    const result: Product = await store.show(2);
    expect(result.price).toEqual(35);
  });

  it("category() should return a list of products with certain category", async () => {
    const result: Product[] = await store.category("drinks");
    expect(result[0].category).toEqual("drinks");
  });

  it("update() should return an edited product", async () => {
    const { name, price, category } = test_edit_product;
    const result: Product = await store.update(2, { name, price, category });
    expect(result.price).toEqual(25);
  });

  it("remove() should remove a certain product", async () => {
    const result: Product = await store.remove(2);
    expect(result.id).toEqual(2);
  });
});
