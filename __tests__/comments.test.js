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



describe("9. GET /api/reviews/:review_id/comments tests", () => {
    test('400: should return 400 if review_id is not a number', () => {
        return request(app)
            .get("/api/reviews/beans/comments")
            .expect(400)
            .then((res) => {
                expect(res.text).toBe("invalid id");
            });
    });
    test("404: should return 404 if review_id is the correct format but is not a review_id in DB", () => {
        return request(app)
            .get("/api/reviews/1006/comments")
            .expect(404)
            .then((res) => {
                expect(res.text).toBe("invalid id");
            });
    });
});