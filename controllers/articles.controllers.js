const {retrieveArticle, retrieveAllArticles} = require("../models/articles.models")

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    return retrieveArticle(article_id).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    return retrieveAllArticles().then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}