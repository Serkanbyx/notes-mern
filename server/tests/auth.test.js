const request = require("supertest");

process.env.JWT_SECRET = "test-jwt-secret-for-testing";
process.env.NODE_ENV = "test";

const app = require("../app");
const { createTestUser } = require("./helpers");

require("./setup");

describe("POST /api/auth/register", () => {
  it("should register a new user and return token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.name).toBe("John Doe");
    expect(res.body.user.email).toBe("john@example.com");
    expect(res.body.user.password).toBeUndefined();
  });

  it("should return 409 if email already exists", async () => {
    await createTestUser({ email: "existing@example.com" });

    const res = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "existing@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("should return 400 if password is too short", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test",
      email: "test@example.com",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await createTestUser({
      email: "login@example.com",
    });
  });

  it("should login with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("login@example.com");
  });

  it("should return 401 with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return 401 with non-existent email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if email is empty", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "password123",
    });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });
});
