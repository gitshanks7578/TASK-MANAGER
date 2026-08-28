import { prisma } from "../src/db/db.js"
import { test, expect, beforeAll, afterAll, beforeEach, describe, it } from "vitest"
import request from "supertest"
import app from "../src/app.js"

beforeAll(async () => {
  await prisma.$connect()

  await prisma.$queryRaw`SELECT 1`

  console.log("Test database connected successfully")
})

afterAll(async () => {
  await prisma.$disconnect()
})


describe("POST /auth/register", () => {

  beforeEach(async () => {
    await prisma.task.deleteMany()
    await prisma.projectMember.deleteMany()
    await prisma.project.deleteMany()
    await prisma.user.deleteMany()
  });
  test("should register a user", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "Password123!",
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("user created successfully");
    expect(response.body.data).toBeDefined();
  });
  test("register fails on missing fields", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "test",
        email: "a@b.com"
      })

    expect(response.status).toBe(400)
  })
  test("stored password is hashed", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "test",
        email: "a@b.com",
        password: "12345678"
      })

    const user = await prisma.user.findUnique({
      where: {
        email: "a@b.com"
      }
    })

    expect(user).not.toBeNull()
    expect(user!.passwordHash).not.toBe("12345678")
  })
  test("register fails when email already exists", async () => {
    const email = "duplicate@example.com";

    await request(app)
      .post("/api/auth/register")
      .send({
        name: "test",
        email,
        password: "12345678",
      });

    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "test2",
        email,
        password: "12345678",
      });

    expect(response.status).toBe(409);
  });
});