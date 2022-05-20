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

describe.only("9. GET /api/reviews/:review_id/comments tests", () => {
    test("200: should return an array of reviews objects with the correct format sorted in descending order", () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .expect(200)
          .then((res) => {
            const { comments } = res.body
            expect(Array.isArray(comments)).toBe(true);
            expect(comments).toHaveLength(3);
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                 author: expect.any(String),
                  body: expect.any(String),
                 comment_id: expect.any(Number),
                    created_at: expect.any(String),
                    review_id: expect.any(Number),
                  votes: expect.any(Number)
                })
              );
            });
          });
    })
        test('200: should return empty array with passed a valid review_id that finds a review but it has no comments', () => {
          return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then((res) => {
             
              expect(res.body.msg).toBe("This review has no comments");

            })
          
        });





        test("400: should return 400 if review_id is not a number", () => {
          return request(app)
            .get("/api/reviews/beans/comments")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("invalid id");
            });
        });
     
        test("404: should return 404 if review_id is the correct format but is not a review_id in DB", () => {
          return request(app)
            .get("/api/reviews/1006/comments")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("review does not exist");

            });
        });
});
      

describe("POST /api/reviews/:review_id/comments tests", () => {
  test('200: should take an object with username and body keys and post them as a comment on the review id given', () => {
    const newComment = {
      username: "mallionaire",
      body: "5/10 would rather be in bed",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        const { body } = res;
        expect(typeof body.comment).toBe("object");
        expect.objectContaining({
          comment_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          owner: expect.any(String),
          created_at: expect.any(String),
          review_id: expect.any(Number),
     
        });
      });
  });
  test('400: should return invalid input if request object does not contain both mandatory keys ', () => {
    const reqObj = { inc_votes: "abfe", body: "bacon" };
		return request(app)
      .post("/api/reviews/1/comments")
      .send(reqObj)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid update");
      });
  });
  test("404: should return if user not in DB tries to post ", () => {
    const reqObj = {
      username: "toby",
      body: "5/10 would rather be in bed",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(reqObj)
      .expect(404)
      .then((res) => {
       
        expect(res.body.msg).toBe("invalid user");
      });
  });
  test('404: review id not found ', () => {
      const reqObj = {
        username: "mallionaire",
        body: "5/10 would rather be in bed",
      };
    return request(app)
      .post("/api/reviews/500/comments")
      .send(reqObj)
      .expect(404)
           .then((res) => {
       ;
        expect(res.body.msg).toBe("review does not exist");
      });
    
    
    
  });
});

