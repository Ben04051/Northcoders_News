const articlesRouter = require('express').Router();
const {getArticle, getAllArticles, updateArticleVotes, postNewArticle, deleteArticle} = require("../controllers/articles.controllers")
const {getArticleComments, postComment} = require("../controllers/comments.controllers")


articlesRouter.route("/")
  .get(getAllArticles)
  .post(postNewArticle)

articlesRouter.route("/:article_id")
  .get(getArticle)
  .patch(updateArticleVotes)
  .delete(deleteArticle);

articlesRouter.route("/:article_id/comments")
  .get(getArticleComments)
  .post(postComment);


module.exports = articlesRouter