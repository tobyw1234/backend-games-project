process.env.NODE_ENV = "test";
const request = require("supertest");
const  app  = require("../app");
const db = require("../db/data/test-data");

afterAll(() => {
	if (db.end) db.end();
});

describe("1. GET /api/categories", () => {
      test("GET /api/categories returns an object", () => {
				return request(app)
					.get("/api/categories")
					.expect(200)
					.then((res) => {
						const { body } = res;
						expect(typeof body).toBe("object");
					});
			});
});
