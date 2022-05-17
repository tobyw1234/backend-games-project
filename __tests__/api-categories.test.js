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

describe("1. GET /api/categories", () => {
    test("200: GET /api/categories returns an array of categories", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then((res) => {
                const { body } = res;
                expect(Array.isArray(body.categories)).toBe(true);
            }).then(() => {
                return request(app)
                    .get("/api/categories")
                    .expect(200)
                    .then((categories) => {
                        expect(categories.body.categories).toHaveLength(4);
                        categories.body.categories.forEach((category) => {
                            expect.objectContaining({
                                slug: expect.any(String),
                                description: expect.any(String),
                            });
                        });
                    });
            });
    })

       test('should 404 if invalid endpoint', () => {
           return request(app).get("/api/fakenews").expect(404);
       });
    
    
});

describe("4 get api/reviews/:reviewid", () => { 
test('200: should return an object with data from the review table where review_id matches the given endpoint', () => {
return request(app)
.get("/api/reviews/4")
.expect(200)
.then((res) => {
const { body } = res;
expect(typeof (body.reviews)).toBe("object");
expect.objectContaining({
   review_id: expect.any(Number) ,
    title: expect.any(String),
  review_body: expect.any(String),
  designer:  expect.any(String),
   review_img_url: expect.any(String),
   votes: expect.any(Number),
   category:  expect.any(String),
   owner:  expect.any(String),
   created_at:  expect.any(String)
})
const response =  {
    review_id: 4,
    title: 'Dolor reprehenderit',
    designer: 'Gamey McGameface',
    owner: 'mallionaire',
    review_img_url: 
     'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    review_body:
      'Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod',
    category: 'social deduction',
    created_at: "2021-01-22T11:35:50.936Z",
    votes: 7
  }

expect(body.reviews).toEqual(response)
})
})
    test('404: should respond with 404 when passed a valid number with no review at that ID ', () => {
       return request(app).get("/api/reviews/1006").expect(404);
        
    });
    test('400: should respond with error 400 if passed something not a number as ID', () => {
        return request(app).get("/api/reviews/five").expect(400);
    });
  ;
})

