const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const app = require("../app")
const request = require("supertest")

beforeAll(() => seed(data))
afterAll(() => db.end())

describe("GET/topics", () => {
    test("200: Should respond with all topics in an array of objects containing the properties slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const topics = body;
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
            expect(Object.keys(topic).length).toBe(2)
          });
        });
    });

})
