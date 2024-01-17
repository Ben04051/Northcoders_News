const db = require("../db/connection")
const { includes } = require("../db/data/test-data/articles")
const {getAllColumnNames} = require("../utils")

exports.retrieveArticle = (article_id) => {
 
    return db.query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: article not found"})
        }
        return rows[0]
    })
}

exports.retrieveAllArticles = async (topic_query, sort_by, order) => {

    if(order === undefined){
        order = "desc"
    } if(order === ""){
        return Promise.reject({status: 400, code: "42601", msg:("Bad request")})
    }

    const queryArray = []
    let queryStr = `
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON comments.article_id = articles.article_id
    `
    if(topic_query){
        queryStr +=  ` WHERE articles.topic = $1`
        queryArray.push(topic_query)
    }

    queryStr += ` GROUP BY articles.article_id`
    if(sort_by || sort_by === ""){
        const columns = await getAllColumnNames("articles")
        columns.push("comment_count")
        if(!columns.includes(sort_by)){
            return Promise.reject({status: 404, msg: "404: column not found"})
        }
        queryStr += ` ORDER BY articles.${sort_by} ${order}`
    } else{
        queryStr += ` ORDER BY articles.created_at ${order}`
    }

    return db.query(queryStr, queryArray)
    .then(({rows}) => {
        return rows
    })

}

exports.amendArticleVotes = (article_id, inc_votes) => {
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [inc_votes, article_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg:"404: article not found"})
        }
        return rows[0]
    })
}
