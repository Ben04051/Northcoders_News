const {retrieveArticleComments} = require("../models/comments.models.js")

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    return retrieveArticleComments(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}