process.env.NODE_ENV = "test";
const request = require("supertest");
const  app  = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data")


beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	if (db.end) db.end();
});

//do beforeaach on onbe line 


describe("1. GET /api/categories", () => {
      test("200: GET /api/categories returns an array", () => {
				return request(app)
					.get("/api/categories")
					.expect(200)
					.then((res) => {
                        const { body } = res;
                        console.log(body.categories, "body")
						expect(Array.isArray(body.categories)).toBe(true);
                    });
          
      });
    test("200: returns all of the available treasures", () => {
			return request(app)
				.get("/api/categories")
				.expect(200)
				.then((treasures) => {
					// console.log(treasures.body.categories, "this one is the one that we want")
					expect(treasures.body.categories).toHaveLength(4);
					treasures.body.categories.forEach((treasure) => {
						expect.objectContaining({
							slug: expect.any(String),
							description: expect.any(String),
						});
					});
				});
		});
       test('should 404 if invalid endpoint', () => {
           return request(app).get("/api/fakenews").expect(404);
       });
    
    
});
