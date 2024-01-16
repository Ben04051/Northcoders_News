const {retrieveArticleComments, createComment, removeComment} = require("../models/comments.models.js")

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    return retrieveArticleComments(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const {username, body} = req.body
    const {article_id} = req.params
    return createComment(username, body, article_id).then((comment) => {
        res.status(201).send({comment})
    }).catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    return removeComment(comment_id).then(() => {
        res.status(204).send()
    }).catch((err) => {
        next(err)
    })
}