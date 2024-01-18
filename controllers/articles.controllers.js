const {retrieveArticle, retrieveAllArticles, amendArticleVotes, createArticle} = require("../models/articles.models")
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
    const {topic_query, sort_by,order} = req.query
    const getArticles = retrieveAllArticles(topic_query, sort_by, order)
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

exports.postNewArticle = (req, res, next) => {
    const {author, title, body, topic, article_img_url} = req.body
    return createArticle(author, title, body, topic, article_img_url).then((article) => {
        res.status(201).send({article})
    }).catch((err) => {
        next(err)
    })
}