process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	if (db.end) db.end();
});


describe("4 get api/reviews/:reviewid", () => {
	test("200: should return an object with data from the review table where review_id matches the given endpoint", () => {
		return request(app)
			.get("/api/reviews/4")
			.expect(200)
			.then((res) => {
				const { body } = res;
				expect(typeof body.reviews).toBe("object");

				expect(body.reviews).toEqual(
					expect.objectContaining({
						review_id: expect.any(Number),
						title: expect.any(String),
						review_body: expect.any(String),
						designer: expect.any(String),
						review_img_url: expect.any(String),
						votes: expect.any(Number),
						category: expect.any(String),
						owner: expect.any(String),
						created_at: expect.any(String),
					})
				);
			});
	});
	test("404: should respond with 404 when passed a valid number with no review at that ID ", () => {
		return request(app)
			.get("/api/reviews/1006")
			.expect(404)
			.then((res) => {
				expect(res.text).toBe("director not found");
			});
	});

	test("400: should respond with error 400 if passed something not a number as ID", () => {
		return request(app)
			.get("/api/reviews/five")
			.expect(400)
			.then((res) => {
				expect(res.text).toBe("invalid id");
			});
	});
	test("review response object should include a comment_count key which is the total number of comments with passed review id", () => {
		return request(app)
			.get("/api/reviews/3")
			.expect(200)
			.then((res) => {
				const { body } = res;
				expect(body.reviews).toEqual(
					expect.objectContaining({
						comment_count: expect.any(Number),
					})
				);
			});
	});
});


describe("5. PATCH /api/reviews/:review_id tests", () => {
	test("should respond with a review object with the correct keys", () => {
		const inc_votes = { inc_votes: 3 };
		return request(app)
			.patch("/api/reviews/4")
			.send(inc_votes)
			.expect(200)
			.then((res) => {
				const { body } = res;
				expect(typeof body.review).toBe("object");
				expect.objectContaining({
					review_id: expect.any(Number),
					title: expect.any(String),
					review_body: expect.any(String),
					designer: expect.any(String),
					review_img_url: expect.any(String),
					votes: expect.any(Number),
					category: expect.any(String),
					owner: expect.any(String),
					created_at: expect.any(String),
				});
			});
	});
	test("should change the value of reviews to the value passed in inc_votes object where review_id matches", () => {
		const inc_votes = { inc_votes: 3 };
		return request(app)
			.patch("/api/reviews/4")
			.send(inc_votes)
			.expect(200)
			.then((res) => {
				const { body } = res;
				expect(body.review.votes).toBe(3);
			});
	});
	test("404: should respond with invalid review when passed validly formated endpoint which is not a review_id", () => {
		const inc_votes = { inc_votes: 3 };
		return request(app)
			.patch("/api/reviews/1006")
			.send(inc_votes)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("invalid review");
			});
	});
	test("400: should respond with invalid id when given endpoint thats not a number", () => {
		const inc_votes = { inc_votes: 3 };
		return request(app)
			.patch("/api/reviews/fish")
			.send(inc_votes)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("invalid id");
			});
	});
	test("400: should respond with invalid update when given inc_votes object that contains not a number", () => {
		const inc_votes = { inc_votes: "abfe" };
		return request(app)
			.patch("/api/reviews/4")
			.send(inc_votes)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("invalid update");
			});
	});
	test("400: should respond with invalid update when given inc_votes object that contains the wrong key", () => {
		const inc_votes = { Margaret_thatcher: 4 };
		return request(app)
			.patch("/api/reviews/4")
			.send(inc_votes)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("invalid update");
			});
	});
});


describe("GET /api/reviews tests", () => {
	test("200: should return an array of reviews objects with the correct format sorted in descending order", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((res) => {
				const reviews = res.body.reviews;
				expect(reviews).toBeSortedBy("created_at", { descending: true });
				expect(Array.isArray(reviews)).toBe(true);
				expect(reviews).toHaveLength(13);
				reviews.forEach((review) => {
					expect(review).toEqual(expect.objectContaining({
						title: expect.any(String),
						review_id: expect.any(Number),
						category: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						comment_count: expect.any(Number),
							
					})
					)
						
				});
			});
	});
})
describe('/api/review queries tests', () => {
	test('should accept order query which sorts in either ascending or descending depending on query ', () => {
		return request(app)
			.get("/api/reviews?order=asc")
			.expect(200)
			.then((res) => {
				const reviews = res.body.reviews;
				expect(reviews).toBeSortedBy("created_at", { ascending: true });

			});
	});
	test('should accept cateogry query which filters results by that category ', () => {
		return request(app)
			.get("/api/reviews?category=euro_game")
			.expect(200)
			.then((res) => {
				const reviews = res.body.reviews;
				expect(reviews).toBeSortedBy("created_at", { ascending: true });

			});
	})
	test('400: should respond with invalid order if given an invalid order query', () => {
		return request(app)
      .get("/api/reviews?order=big")
      .expect(400)
      .then((res) => {
        const reviews = res.body.reviews;
        expect(res.body.msg).toBe("invalid id");
      });
	})
})
