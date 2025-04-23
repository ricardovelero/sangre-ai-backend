const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Adjust if your Express app is elsewhere
const User = require("../models/auth.model");

describe("Auth Controller", () => {
  let server;
  let testUser = {
    email: "testuser@example.com",
    password: "TestPass123!",
    firstName: "Test",
    lastName: "User",
  };
  let tokens = {};

  beforeAll(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test("Register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user.email).toBe(testUser.email);
  });

  test("Login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("refreshToken");
    expect(res.body.user.email).toBe(testUser.email);
    tokens = { token: res.body.token, refreshToken: res.body.refreshToken };
  });

  test("Get authenticated user", async () => {
    const res = await request(app)
      .get("/api/auth/user")
      .set("Authorization", `Bearer ${tokens.token}`)
      .expect(200);

    expect(res.body.email).toBe(testUser.email);
  });

  test("Update user password", async () => {
    const res = await request(app)
      .put("/api/auth/user/password")
      .set("Authorization", `Bearer ${tokens.token}`)
      .send({ currentPassword: testUser.password, newPassword: "NewPass123!" })
      .expect(200);

    expect(res.body.message).toMatch(/Contraseña actualizada/);
  });

  test("Login with new password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "NewPass123!" })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    tokens.token = res.body.token;
  });

  test("Request password reset", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({ email: testUser.email })
      .expect(200);

    expect(res.body.message).toMatch(/enlace para restablecer la contraseña/);
  });

  test("Refresh token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: tokens.refreshToken })
      .expect(200);

    expect(res.body).toHaveProperty("token");
  });

  test("Logout", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .send({ refreshToken: tokens.refreshToken })
      .expect(200);

    expect(res.body.message).toMatch(/Cierre de sesión exitoso/);
  });

  test("Delete user", async () => {
    // Login again to get a valid token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "NewPass123!" });

    const token = loginRes.body.token;

    const res = await request(app)
      .delete("/api/auth/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toMatch(/Cuenta eliminada exitosamente/);
  });
});
