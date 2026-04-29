const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Product = require("../src/models/Product");
const generateToken = require("../src/utils/generateToken");

describe("Cart API", () => {
  let userToken;
  let productId;

  beforeEach(async () => {
    const user = await User.create({
      name: "Cart User",
      email: "cart@example.com",
      password: "password123",
      role: "customer",
    });
    userToken = generateToken(user._id);

    const product = await Product.create({
      title: "Cart Artwork",
      description: "Testing cart",
      price: 50,
      imageUrl: "/uploads/test.jpg",
      stock: 5,
      creator: "Test Artist",
    });
    productId = product._id;
  });

  it("should add an item to the cart", async () => {
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [{ product: productId, quantity: 1 }],
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].product._id.toString()).toEqual(productId.toString());
  });

  it("should update quantity if item already in cart", async () => {
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ items: [{ product: productId, quantity: 1 }] });

    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ items: [{ product: productId, quantity: 3 }] });

    expect(res.statusCode).toEqual(200);
    expect(res.body.items[0].quantity).toEqual(3);
  });

  it("should fetch user cart", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});
