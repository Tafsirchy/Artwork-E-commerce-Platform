const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const generateToken = require("../src/utils/generateToken");

describe("Product API", () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    adminToken = generateToken(admin._id);

    const user = await User.create({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
      role: "customer",
    });
    userToken = generateToken(user._id);
  });

  it("should fetch all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should not allow non-admins to create a product", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        title: "Test Artwork",
        description: "A beautiful piece of art",
        price: 100,
        stock: 1,
        creator: "Test Artist",
      });

    expect(res.statusCode).toEqual(401); // Unauthorized (not admin)
  });

  // Note: Testing actual file upload with Supertest requires .attach()
  // But we can test validation without file if we skip the multer check in a mock
  // Or just test that it fails without a file
  it("should fail to create a product without an image", async () => {
    const res = await request(app)
      .post("/api/products")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Test Artwork",
        description: "A beautiful piece of art",
        price: 100,
        stock: 1,
        creator: "Test Artist",
      });

    expect(res.statusCode).toEqual(400);
  });
});
