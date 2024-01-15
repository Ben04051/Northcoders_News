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
          const {topics } = body;
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
          expect(topics.length).toBeGreaterThan(0)
        });
    });
})

describe("GET/api", () => {
    test("200: serves up a json representation of all the available endpoints of the api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
           const {endpoints} = body
          for (const key in endpoints){
            const endpoint = (endpoints[key])
            expect(typeof endpoint.description).toBe("string")
            expect(typeof endpoint.queries).toBe("object")
            expect(typeof endpoint.format).toBe("string")
            expect(Object.keys(endpoint).length).toBe(4)
          }
        });
    });
})

describe("GET/api/articles", () => {
    test("200: gets all articles, with the body property removed, a commment count added and sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
           const {articles} = body
           articles.forEach((article) => {
           expect(typeof article.author).toBe("string")
           expect(typeof article.title).toBe("string")
           expect(typeof article.article_id).toBe("number")
           expect(typeof article.topic).toBe("string")
           expect(typeof article.created_at).toBe("string")
           expect(typeof article.votes).toBe("number")
           expect(typeof article.article_img_url).toBe("string")
           expect(typeof article.comment_count).toBe("number")
           expect(Object.keys(article).length).toBe(8)
        })
          expect(articles).toBeSortedBy("created_at", {descending: true})
        });
    });
})

describe("GET/api/articles/:article_id", () => {
    test("200: gets an article by its article id and returns the object with the correct properties", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
           const {article} = body
           expect(typeof article.author).toBe("string")
           expect(typeof article.title).toBe("string")
           expect(typeof article.article_id).toBe("number")
           expect(typeof article.body).toBe("string")
           expect(typeof article.topic).toBe("string")
           expect(typeof article.created_at).toBe("string")
           expect(typeof article.votes).toBe("number")
           expect(typeof article.author).toBe("string")
        });
    });
    test("400: test that when given an invalid id that bad request is returned", () => {
        return request(app)
          .get("/api/articles/thatarticleiwant")
          .expect(400)
          .then(({ body }) => {
             expect(body.msg).toBe("Bad request")
          });
      });
    test("404: test that when given a valid but out of range id that \"404: article not found\" is returned", () => {
    return request(app)
        .get("/api/articles/99")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404: article not found")
        });
    });
})


describe("GET/non-existent API", () => {
    test("404: will return a 404 error when given an incorrect endpoint that a 404 and error message will be returned", () => {
      return request(app)
        .get("/api/thiswillneverbeafilepath")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe("404: endpoint not found")
        })
        });
    });
