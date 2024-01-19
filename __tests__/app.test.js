const data = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const app = require("../app")
const request = require("supertest")

beforeAll(() => seed(data))
afterAll(() => db.end())

describe("GET requests", () => {
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
  
  describe("GET/api/articles?limit&?p", () => {
    test("200: tests that the correct total count is returned", () => {
      return request(app)
        .get("/api/articles?limit=10&p=1")
        .expect(200)
        .then(({ body }) => {
           const {total_count} = body
           expect(total_count).toBe(13)
        })
        });
    test("200: tests that the pagination works", () => {
      return request(app)
        .get("/api/articles?limit=5&p=3")
        .expect(200)
        .then(({ body }) => {
           const {articles} = body
           expect(articles.length).toBe(3)
        });
    });
    test("404: tests that when given a page out of range that a 404 error will be returned ", () => {
      return request(app)
        .get("/api/articles?limit=5&p=4")
        .expect(404)
        .then(({ body }) => {
         expect(body.msg).toBe("404: page not found")
        });
    });
    test("400: tests that when given a null limit out of range that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?limit=0&p=1")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a negative limit out of range that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?limit=-7&p=1")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a decimal integer limit that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?limit=7.5")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a decimal integer p that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?p=1.5")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a none integer limit value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?limit=twelve")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a none integer p value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?p=three")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given an empty limit value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?limit=")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given an empty p value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles?p=")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
      
  })
  
  describe("GET/api/articles?topic_query", () => { 
    test("200: tests that when passed a valid topic filter query that the results served by the get request will be filtered to include these results", () => {
      return request(app)
        .get("/api/articles?topic_query=mitch")
        .expect(200)
        .then(({ body }) => {
            const {articles} = body
            expect(articles.length).toBeGreaterThan(0)
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
             expect(comments.length).toBe(10)
             expect(comments).toBeSortedBy("created_at", {descending: true})
          });
      });
      test("404: returns comments not found when no comments are available on the page", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(404)
          .then(({ body }) => {
             expect(body.msg).toEqual('404: comments not found')
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
  
  describe("GET/api/articles/:article_id/comments?limit&?p", () => {
     test("200: tests that the pagination works", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=10&p=2")
        .expect(200)
        .then(({ body }) => {
           const {comments} = body
           expect(comments.length).toBe(1)
        });
    });
    test("404: tests that when given a page out of range that a 404 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5&p=4")
        .expect(404)
        .then(({ body }) => {
         expect(body.msg).toBe("404: comments not found")
        });
    });
    test("400: tests that when given a null limit out of range that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=0&p=1")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a negative limit out of range that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=-7&p=1")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a decimal integer limit that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=7.5")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a decimal integer p that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?p=1.5")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a none integer limit value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=twelve")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given a none integer p value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?p=three")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given an empty limit value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
        });
    });
    test("400: tests that when given an empty p value that a 400 error will be returned ", () => {
      return request(app)
        .get("/api/articles/1/comments?p=")
        .expect(400)
        .then(({ body }) => {
         expect(body.msg).toBe("Bad request")
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
  
})

describe("POST requests", () => {
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
          expect(body.msg).toBe("404: article_id not found")
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
         expect(body.msg).toBe("404: author not found")
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

describe('POST/api/articles', () => {
  test('201: inserts a new article to the list of articles', () => {
    const articleToAdd = {
      author: "butter_bridge",
      title: "Post request success",
      body: "This article was posted to the articles table using a post request!",
      topic: "mitch",
      article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    }  
    return request(app)
    .post("/api/articles/")
    .send(articleToAdd)
    .expect(201)
    .then(({body}) => {
      const {article} = body
      expect(article.article_id).toBe(14)
      expect(article.author).toBe(articleToAdd.author)
      expect(article.title).toBe(articleToAdd.title)
      expect(article.body).toBe(articleToAdd.body)
      expect(article.topic).toBe(articleToAdd.topic)
      expect(article.article_img_url).toBe(articleToAdd.article_img_url)
      expect(typeof article.votes).toBe("number")
      expect(typeof article.created_at).toBe("string")
      expect(typeof article.comment_count).toBe("number")
    }) 
  })
  test('201: test the function works when not passed an article_img_url', () => {
    const articleToAdd = {
      author: "butter_bridge",
      title: "Post request success",
      body: "This article was posted to the articles table using a post request!",
      topic: "mitch",
    }  
    return request(app)
    .post("/api/articles/")
    .send(articleToAdd)
    .expect(201)
    .then(({body}) => {
      const {article} = body
      expect(article.article_id).toBe(15)
      expect(article.author).toBe(articleToAdd.author)
      expect(article.title).toBe(articleToAdd.title)
      expect(article.body).toBe(articleToAdd.body)
      expect(article.topic).toBe(articleToAdd.topic)
      expect(article.article_img_url).toBe('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
      expect(typeof article.votes).toBe("number")
      expect(typeof article.created_at).toBe("string")
      expect(typeof article.comment_count).toBe("number")
    }) 
  }) 
  test("404: test that when passeed an invalid author that 404: author not found is returned", () => {
  const articleToAdd = {
    author: "butter_bridge123",
      title: "Post request success",
      body: "This article was posted to the articles table using a post request!",
      topic: "mitch",
  }            
  return request(app)
  .post("/api/articles/")
  .send(articleToAdd)
  .expect(404)
  .then(({body}) => {
       expect(body.msg).toBe("404: author not found")
    });
});
test("404: test that when passeed an invalid topic that 404: topic not found is returned", () => {
  const articleToAdd = {
    author: "butter_bridge",
      title: "Post request success",
      body: "This article was posted to the articles table using a post request!",
      topic: "mitch12",
  }            
  return request(app)
  .post("/api/articles/")
  .send(articleToAdd)
  .expect(404)
  .then(({body}) => {
       expect(body.msg).toBe("404: topic not found")
    });
});
test("400: test that when topic is missing from the post request that a Bad request error is returned", () => {
  const articleToAdd = {
    author: "butter_bridge",
      title: "Post request success",
      body: "This article was posted to the articles table using a post request!",
  }        
return request(app)
.post("/api/articles/")
.send(articleToAdd)
.expect(400)
.then(({body}) => {
      expect(body.msg).toBe("Bad request")
  });
});
test("400: test that when body is missing from the post request that a Bad request error is returned", () => {
  const articleToAdd = {
    author: "butter_bridge",
      title: "Post request success",
      topic: "mitch",
  }        
return request(app)
.post("/api/articles/")
.send(articleToAdd)
.expect(400)
.then(({body}) => {
      expect(body.msg).toBe("Bad request")
  });
});
test("400: test that when author is missing from the post request that a Bad request error is returned", () => {
  const articleToAdd = {
      title: "Post request success",
      body: "This article was posted to the articles table using a post request!",
      topic: "mitch",
  }        
return request(app)
.post("/api/articles/")
.send(articleToAdd)
.expect(400)
.then(({body}) => {
      expect(body.msg).toBe("Bad request")
  });
});
test("400: test that when title is missing from the post request that a Bad request error is returned", () => {
  const articleToAdd = {
    author: "butter_bridge",
      body: "This article was posted to the articles table using a post request!",
      topic: "mitch",
  }        
return request(app)
.post("/api/articles/")
.send(articleToAdd)
.expect(400)
.then(({body}) => {
      expect(body.msg).toBe("Bad request")
  });
});
})

describe('POST/api/topics', () => {
  test('201: inserts a new topic to the list of topics', () => {
    const topicToAdd = {
      slug: "new slug",
      description: "new description"
    }
    return request(app)
    .post("/api/topics/")
    .send(topicToAdd)
    .expect(201)
    .then(({body}) => {
      const {topic} = body
      expect(topic.slug).toBe("new slug")
      expect(topic.description).toBe("new description")
    }) 
  })
test("201: test that when description is missing from the post request that a Bad request error is returned", () => {
  const topicToAdd = {
    slug: "second slug"
  }    
return request(app)
.post("/api/topics/")
.send(topicToAdd)
.expect(201)
.then(({body}) => {
  const {topic} = body
  expect(topic.slug).toBe("second slug")
  expect(topic.description).toBe(null)
  });
});
test("409: test that when a duplicate slug is used that a 409 conflict error is returned", () => {
  const topicToAdd = {
    slug: "second slug"
  }    
return request(app)
.post("/api/topics/")
.send(topicToAdd)
.expect(409)
.then(({body}) => {
  expect(body.msg).toBe(`409: slug already in use`)
  });
});
test("400: test that when slug is missing from the post request that a Bad request error is returned", () => {
  const topicToAdd = {
    description: "new description"
  }    
return request(app)
.post("/api/topics/")
.send(topicToAdd)
.expect(400)
.then(({body}) => {
  expect(body.msg).toBe("Bad request")
});
});
})
})

describe("PATCH requests", () => {

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
  
  
  describe("PATCH/api/comments/:comment_id", () => {
    test("200: test that when given a patch request with a comment and a body containing a number of votes that the comment's votes will be updated", () => {
      return request(app)
      .patch("/api/comments/1")
      .send({inc_votes : 10})
      .expect(200)
      .then(({body}) => {
        const {comment} = body
        expect(comment.votes).toEqual(26)
      }).then(() => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes : -10})
        .expect(200)
      })
    })
    test("200: test that when the result is a negative number that the comment will be returned", () => {
      return request(app)
      .patch("/api/comments/1")
      .send({inc_votes : -26})
      .expect(200)
      .then(({body}) => {
        const {comment} = body
        expect(comment.votes).toEqual(-10)
      }).then(() => {
        return request(app)
        .patch("/api/comments/1")
        .send({inc_votes : 26})
        .expect(200)
      })
    })
    test("400: test that when given an invalid comment_id that bad request is returned", () => {    
      return request(app)
      .patch("/api/comments/notavalidid")
      .send({inc_votes : -300})
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
    test("404: test that when given a valid but out of range comment_id that \"404: not found\" is returned", () => {
      return request(app)
      .patch("/api/comments/99")
      .send({inc_votes : -300})
      .expect(404)
      .then(({body}) => {
            expect(body.msg).toBe("404: comment not found")
        });
    });
    test("400: test that when given an invalid inc_votes value that bad request will be returned", () => {    
      return request(app)
      .patch("/api/comments/1")
      .send({inc_votes : "hello"})
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
    test("400: test that decimals will not be accepted", () => {    
      return request(app)
      .patch("/api/comments/1")
      .send({inc_votes : 47.5})
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
    test("400: test that Bad request is returned when inc_votes is not passed in the body", () => {    
      return request(app)
      .patch("/api/comments/1")
      .send()
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
  })
  

})

describe("DELETE requests", () => {

  describe("DELETE/api/comments/:comment_id", () => {
    test("204: test that when given a valid id that the comment is removed", () => {
      return request(app)
      .delete("/api/comments/2")
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
  
  describe("DELETE/api/articles/:article_id", () => {
    test("204: test that when given a valid id that the article is removed", () => {
      return request(app)
      .delete("/api/articles/2")
      .expect(204) 
    })
    test("204: test that all the comments for an article are deleted", () => {
      return request(app)
      .delete("/api/articles/3")
      .expect(204).then(() => {
        return db.query(`SELECT FROM comments
          WHERE article_id = 3`)
      }).then(({rowCount}) => {
        expect(rowCount).toBe(0)
      }) 
    })
    test("404: test that when given a valid but out of range article_id that \"404: not found\" is returned", () => {
      return request(app)
      .delete("/api/articles/99")
      .expect(404)
      .then(({body}) => {
            expect(body.msg).toBe("404: article not found")
        });
    });
    test("400: test that when given an invalid article_id that Bad request is returned", () => {    
      return request(app)
      .patch("/api/articles/notavalidarticleid")
      .expect(400)
      .then(({body}) => {
            expect(body.msg).toBe("Bad request")
        });
    });
  
  })
})








