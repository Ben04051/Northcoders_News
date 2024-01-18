const articlesRouter = require('express').Router();
const {getArticle, getAllArticles, updateArticleVotes} = require("../controllers/articles.controllers")
const {getArticleComments, postComment} = require("../controllers/comments.controllers")


articlesRouter.get("/", getAllArticles)

articlesRouter.route("/:article_id")
  .get(getArticle)
  .patch(updateArticleVotes);

articlesRouter.route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);


module.exports = articlesRouter