const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const app = require("../app")
const request = require("supertest")

beforeAll(() => seed(data))
afterAll(() => db.end())

describe("GET/api", () => {
  test("200: serves up a json representation of all the available endpoints of the api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
         const {endpoints} = body
         expect(Object.keys(endpoints).length).toBeGreaterThan(0)
        for (const key in endpoints){
          const endpoint = (endpoints[key])
          expect(typeof endpoint.description).toBe("string")
          expect(typeof endpoint.queries).toBe("object")
          expect(typeof endpoint.format).toBe("string")
        }
      });
  });
})

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
    
describe("GET/api/articles", () => {
    test("200: gets all articles wiht a commment count added and sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
           const {articles} = body
           expect(articles.length).toBeGreaterThan(0)
           articles.forEach((article) => {
           expect(typeof article.author).toBe("string")
           expect(typeof article.title).toBe("string")
           expect(typeof article.article_id).toBe("number")
           expect(typeof article.topic).toBe("string")
           expect(typeof article.created_at).toBe("string")
           expect(typeof article.votes).toBe("number")
           expect(typeof article.article_img_url).toBe("string")
           expect(typeof article.comment_count).toBe("number")
           expect(Object.keys(article).includes("body")).toBe(false)
        })
        });
    });
    test("200: tests that the body property is removed from all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
           const {articles} = body
           articles.forEach((article) => {
           expect(Object.keys(article).includes("body")).toBe(false)
        })
        });
    });
    test("200: tests that the articles are sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
           const {articles} = body
           expect(articles).toBeSortedBy("created_at", {descending: true})
        });    
      }) 
})

describe("GET/api/articles?topic_query", () => { 
  test("200: tests that when passed a valid topic filter query that the results served by the get request will be filtered to only include these results", () => {
    return request(app)
      .get("/api/articles?topic_query=mitch")
      .expect(200)
      .then(({ body }) => {
          const {articles} = body
          expect(articles.length).toBe(12)
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch")
          })
      });    
  })
  test("404: tests that when passed an invalid topic filter query that a 404 error will be returned", () => {
    return request(app)
      .get("/api/articles?topic_query=99asdfnotatopic")
      .expect(404)
      .then(({ body }) => {
            expect(body.msg).toBe("404: topic not found")
      });    
  })
  test("404: tests that when passed an empty query that a 404 error will be returned", () => {
    return request(app)
      .get("/api/articles?topic_query=")
      .expect(404)
      .then(({ body }) => {
            expect(body.msg).toBe("404: topic not found")
      });    
  })
})

describe("GET/api/articles?sort_by", () => { 
  test("200: tests that when passed a valid topic filter query that the results served by the get request will be filtered to only include these results", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        const {articles} = body
          expect(articles).toBeSortedBy("author", {descending: true})
      });    
  })
  test("404: tests that when passed an invalid sort_by query that a 404 error will be returned", () => {
    return request(app)
      .get("/api/articles?sort_by=99asdfnotatopic")
      .expect(404)
      .then(({ body }) => {
            expect(body.msg).toBe("404: column not found")
      });    
  })
   test("404: tests that when passed an empty query that a 404 error will be returned", () => {
    return request(app)
      .get("/api/articles?sort_by=")
      .expect(404)
      .then(({ body }) => {
            expect(body.msg).toBe("404: column not found")
      });    
  })
})

describe("GET/api/articles?order", () => { 
  test("200: tests that when passed a valid order that it will be returned in that order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const {articles} = body
          expect(articles).toBeSortedBy("created_at", {descending: false})
      });    
  })
  test("404: tests that when passed an invalid order query that a 400 error will be returned", () => {
    return request(app)
      .get("/api/articles?order=99asdfnotatopic")
      .expect(400)
      .then(({ body }) => {
            expect(body.msg).toBe("Bad request")
      });    
  })
   test("404: tests that when passed an empty query that a 400 error will be returned", () => {
    return request(app)
      .get("/api/articles?order=")
      .expect(400)
      .then(({ body }) => {
            expect(body.msg).toBe("Bad request")
      });    
  })
})


describe("GET/api/articles/:article_id/comments", () => {
    test("200: gets all comments when given a specific article_id with most recent comments passed first", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
           const {comments} = body
           const testComment = comments[0]
           expect(testComment.comment_id).toBe(5)
           expect(testComment.votes).toBe(0)
           expect(testComment.created_at).toBe("2020-11-03T21:00:00.000Z")
           expect(testComment.author).toBe("icellusedkars")
           expect(testComment.body).toBe('I hate streaming noses')
           expect(testComment.article_id).toBe(1)
           expect(comments.length).toBe(11)
           expect(comments).toBeSortedBy("created_at", {descending: true})
        });
    });
    test("200: returns an empty object when the article has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
           const {comments} = body
           expect(comments).toEqual([])
        });
    });
    test("400: test that when given an invalid id that bad request is returned", () => {
        return request(app)
          .get("/api/articles/thatarticleiwant/comments")
          .expect(400)
          .then(({ body }) => {
             expect(body.msg).toBe("Bad request")
          });
      });
    test("404: test that when given a valid but out of range id that \"404: article not found\" is returned", () => {
    return request(app)
        .get("/api/articles/99/comments")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("404: article not found")
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
           expect(typeof article.comment_count).toBe("number")
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

describe("GET /api/users", () => {
  test("200: Should respond with all users in an array of objects containing the properties username, name and avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const {users} = body;
        expect(users.length).toBeGreaterThan(0)
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
})

describe("GET /api/users/:username", () => {
  test("200: Should respond with all users in an array of objects containing the properties username, name and avatar_url", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const {user} = body;
        expect(Object.keys(user).length).toBeGreaterThan(0)
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe("https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg");
      });
  });
  test("404: tests that when passed an invalid username that a 404 error will be returned", () => {
    return request(app)
      .get("/api/users/90wfjasfkj")
      .expect(404)
      .then(({ body }) => {
            expect(body.msg).toBe("404: username not found")
      });    
  })
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

describe('POST/api/articles/:article_id/comments', () => {
        test('201: inserts a new comment to a given article and returns the posted comment', () => {
          const commentToAdd = {
            username: "butter_bridge",
            body: "Interesting article!"
          }  
          return request(app)
          .post("/api/articles/1/comments")
          .send(commentToAdd)
          .expect(201)
          .then(({body}) => {
            const {comment} = body
            expect(typeof comment.comment_id).toBe("number")
            expect(comment.body).toBe(commentToAdd.body)
            expect(comment.article_id).toBe(1)
            expect(comment.author).toBe(commentToAdd.username)
            expect(comment.votes).toBe(0)
            expect(typeof comment.created_at).toBe("string")
          })
        })
        test("400: test that when given an invalid article_id that bad request is returned", () => {
          const commentToAdd = {
            username: "butter_bridge",
            body: "Interesting article!"
          }            
          return request(app)
          .post("/api/articles/nevervalidid/comments")
          .send(commentToAdd)
          .expect(400)
          .then(({body}) => {
               expect(body.msg).toBe("Bad request")
            });
        });
      test("404: test that when given a valid but out of range article_id that \"404: not found\" is returned", () => {
        const commentToAdd = {
          username: "butter_bridge",
          body: "Interesting article!"
        }      
        return request(app)
        .post("/api/articles/99/comments")
        .send(commentToAdd)
        .expect(404)
        .then(({body}) => {
              expect(body.msg).toBe("404: not found")
          });
      });
      test("404: test that when given an invalid username that not found is returned", () => {
        const commentToAdd = {
          username: "butter_bridge1234",
          body: "Interesting article!"
        }            
        return request(app)
        .post("/api/articles/1/comments")
        .send(commentToAdd)
        .expect(404)
        .then(({body}) => {
             expect(body.msg).toBe("404: not found")
          });
      });
    test("400: test that when body is missing from the post request that a Bad request error is returned", () => {
      const commentToAdd = {
        username: "butter_bridge",
      }      
      return request(app)
      .post("/api/articles/1/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
    test("400: test that when username is missing from the post request that a Bad request error is returned", () => {
      const commentToAdd = {
        body: "Interesting article!"
      }      
      return request(app)
      .post("/api/articles/1/comments")
      .send(commentToAdd)
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
  })

  describe("PATCH/api/articles/:article_id", () => {
    test("200: test that when given a patch request with an article_id and a body containing a number of votes that the article's votes will be updated", () => {
      return request(app)
      .patch("/api/articles/1")
      .send({inc_votes : 50})
      .expect(200)
      .then(({body}) => {
        const {article} = body
        expect(article.votes).toEqual(150)
      }).then(() => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes : -50})
        .expect(200)
        //re-setting the votes after each test so that test data isn't affected- not sure if this is good practice
      })
    })
    test("200: test that when the result is a negative number that the article will be returned", () => {
      return request(app)
      .patch("/api/articles/1")
      .send({inc_votes : -300})
      .expect(200)
      .then(({body}) => {
        const {article} = body
        expect(article.votes).toEqual(-200)
      }).then(() => {
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes : 300})
        .expect(200)
      })
    })
    test("400: test that when given an invalid article_id that bad request is returned", () => {    
      return request(app)
      .patch("/api/articles/notavalidid")
      .send({inc_votes : -300})
      .expect(400)
      .then(({body}) => {
           expect(body.msg).toBe("Bad request")
        });
    });
    test("404: test that when given a valid but out of range article_id that \"404: not found\" is returned", () => {
      return request(app)
      .patch("/api/articles/99")
      .send({inc_votes : -300})
      .expect(404)
      .then(({body}) => {
            expect(body.msg).toBe("404: article not found")
        });
    });
    test("400: test that when given an invalid inc_votes value that bad request will be returned", () => {    
      return request(app)
      .patch("/api/articles/1")
      .send({inc_votes : "hello"})
      .expect(400)
      .then(({body}) => {
           expect(body.msg).toBe("Bad request")
        });
    });
    test("400: test that decimals will not be accepted", () => {    
      return request(app)
      .patch("/api/articles/1")
      .send({inc_votes : 47.5})
      .expect(400)
      .then(({body}) => {
           expect(body.msg).toBe("Bad request")
        });
    });
    test("400: test that Bad request is returned when inc_votes is not passed in the body", () => {    
      return request(app)
      .patch("/api/articles/1")
      .send()
      .expect(400)
      .then(({body}) => {
           expect(body.msg).toBe("Bad request")
        });
    });
  })

  describe("DELETE/api/comments/:comment_id", () => {
    test("204: test that when given a valid id that the comment is removed", () => {
      return request(app)
      .delete("/api/comments/1")
      .expect(204) 
    })
    test("404: test that when given a valid but out of range comment_id that \"404: not found\" is returned", () => {
      return request(app)
      .delete("/api/comments/99")
      .expect(404)
      .then(({body}) => {
            expect(body.msg).toBe("404: comment not found")
        });
    });
    test("400: test that when given an invalid comment_id that Bad request is returned", () => {    
      return request(app)
      .patch("/api/articles/notavalidcommentid")
      .expect(400)
      .then(({body}) => {
           expect(body.msg).toBe("Bad request")
        });
    });

  })


 



 


