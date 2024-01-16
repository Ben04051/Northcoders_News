const {retrieveArticle, retrieveAllArticles, amendArticleVotes} = require("../models/articles.models")
const {checkTopicExists} = require("../utils.js")

exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    return retrieveArticle(article_id).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    const {topic_query} = req.query
    const getArticles = retrieveAllArticles(topic_query)
    const queries = [getArticles]

    if(topic_query || topic_query === "") {
        const topicCheck = checkTopicExists(topic_query)
        queries.push(topicCheck)
    }

    Promise.all(queries).then((response) => {
        const articles = response[0]
        res.status(200).send({articles})
    }).catch((err) => {
        next(err)
    })
}

exports.updateArticleVotes = (req, res, next) => {
    const {article_id} = req.params   
    const {inc_votes} = req.body
    return amendArticleVotes(article_id, inc_votes).then((article) => {
        res.status(200).send({article})
    }).catch((err) => {
        next(err)
    })
}