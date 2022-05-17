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

describe("5. PATCH /api/reviews/:review_id tests", () => {
    test('should respond with a review object with the correct keys', () => {
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
    })
    test('should change the value of reviews to the value passed in inc_votes object where review_id matches', () => {
        const inc_votes = { inc_votes: 3 }
        return request(app)
            .patch("/api/reviews/4")
            .send(inc_votes)
            .expect(200)
            .then((res) => {
                const { body } = res;
                expect(body.review.votes).toBe(3)
            })

    });
    test('404: should respond with invalid review ', () => {
        const inc_votes = { inc_votes: 3 };
        return request(app)
            .patch("/api/reviews/1006")
            .send(inc_votes)
            .expect(404)
            .then((res) => {
                expect(res.text).toBe("invalid review")

            });
    })
       test("400: should respond with invalid id when given endpoint thats not a number", () => {
					const inc_votes = { inc_votes: 3 };
					return request(app)
						.patch("/api/reviews/fish")
						.send(inc_votes)
						.expect(400)
						.then((res) => {
							expect(res.text).toBe("invalid id");
						});
       });
    test("400: should respond with invalid update when given inc_votes object that contains not a number", () => {
			const inc_votes = { inc_votes: "abfe" };
			return request(app)
				.patch("/api/reviews/4")
				.send(inc_votes)
				.expect(400)
				.then((res) => {
					expect(res.text).toBe("invalid update");
				});
	});
	 test.only("400: should respond with invalid update when given inc_votes object that contains the wrong key", () => {
			const inc_votes = { Margaret_thatcher: 4 };
			return request(app)
				.patch("/api/reviews/4")
				.send(inc_votes)
				.expect(400)
				.then((res) => {
					expect(res.text).toBe("invalid update");
				});
		});
    })
