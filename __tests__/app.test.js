const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const app = require("../app")
const request = require("supertest")

beforeAll(() => seed(data))
afterAll(() => db.end())

describe("GET /api/topics", () => {
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

describe("GET/api", () => {
    test("200: serves up a json representation of all the available endpoints of the api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          for (const key in body){
            const endpoint = (body[key])
            expect(typeof endpoint.description).toBe("string")
            expect(typeof endpoint.queries).toBe("object")
            expect(typeof endpoint.format).toBe("string")
            expect(Object.keys(endpoint).length).toBe(4)
          }
        });
    });
})