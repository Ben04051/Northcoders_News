const commentsRouter = require('express').Router();
const {deleteComment, updateCommentVotes} = require("../controllers/comments.controllers")

commentsRouter.route("/:comment_id")
    .patch(updateCommentVotes)
    .delete(deleteComment)

module.exports = commentsRouter