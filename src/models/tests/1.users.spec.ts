import { User, UserStore } from "../user";

const store = new UserStore();

// app.get("/users", verifyAuthToken, index);
//   app.get("/user/:id", verifyAuthToken, show);
//   app.get("/user/:id/orders", verifyAuthToken, getOrders);
//   app.put("/user/:id", verifyAuthToken, edit);
//   app.delete("/user/:id", verifyAuthToken, remove);
//   app.post("/user", register);

describe("User Model: Checking Methods", () => {
  it("should have an index()", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a register()", () => {
    expect(store.register).toBeDefined();
  });

  it("should have an edit()", () => {
    expect(store.edit).toBeDefined();
  });

  it("should have a show()", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a remove()", () => {
    expect(store.remove).toBeDefined();
  });
});

describe("User Model: Testing Functionalities of Methods", () => {
  const test_user = {
    username: "terrycheng",
    first_name: "terry",
    last_name: "cheng",
    password: "123456",
  };

  const edit_test_user = {
    username: "terrycheng",
    first_name: "mary",
    last_name: "cheng",
    password: "123456",
  };

  it("index() should return a list of users", async () => {
    const result: User[] = await store.index();
    expect(result).toEqual([]);
  });

  it("register() should return a new user", async () => {
    const result: User = await store.register(test_user);
    expect(result.username).toEqual("terrycheng");
  });

  it("edit() should return an edited user", async () => {
    const result: User = await store.edit(1, edit_test_user);
    expect(result.firstname).toEqual("mary");
  });

  it("show() should return a certain user", async () => {
    const result: User = await store.show(1);
    expect(result.username).toEqual("terrycheng");
  });

  it("remove() should remove a certain user", async () => {
    const result: User = await store.remove(1);
    expect(result.username).toEqual("terrycheng");
  });
});
