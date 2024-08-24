import request from "supertest";
import app from "../app";
import { loadQuotes } from "../data";

describe("Test the home route - /", () => {
  // Load the quotes data before running the test
  beforeAll(async () => {
    await loadQuotes();
  }, 10000);

  // Testing the route
  test("it should return 200 ok and a random quote", async () => {
    const response = await request(app).get("/api/v1/").expect(200);

    expect(response.body).toHaveProperty("quote");
    expect(response.body).toHaveProperty("author");
    expect(response.body).toHaveProperty("category");
    expect(response.body).toHaveProperty("id");
  });
});
