process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	if (db.end) db.end();
});

describe('Get all users tests', () => {
	test.only('200: should return an array of user objects with the correct format', () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then((res) => {
				const users = res.body.users;
				expect(Array.isArray(users)).toBe(true)
				expect(users).toHaveLength(4)
				users.forEach((user) => {
					expect(user).toEqual(
					expect.objectContaining({
						avatar_url: expect.any(String),
						name: expect.any(String),
						username: expect.any(String)
					})
					)
				})
		})
	});
});