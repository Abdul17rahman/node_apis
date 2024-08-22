import request from "supertest";
import app from "../app";

describe("Test the adding user POST /register.", () => {
  const user = {
    username: "Abdul",
    password: "Abdul",
  };
  test("it should accept json, create user and return 201 created", async () => {
    const response = await request(app)
      .post("/api/v1/register")
      .send(user)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("status");
  });

  test("Returns an error if user is not passed.", async () => {
    const response = await request(app).post("/api/v1/register").send();

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing registration credentials.");
  });
});
