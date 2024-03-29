const db = require("../db/connection")
const { includes } = require("../db/data/test-data/articles")
const {getAllColumnNames, getArticleCount} = require("../utils")

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

exports.retrieveAllArticles = async (topic_query, sort_by, order, limit, p) => {

    if(limit === undefined) limit = 10; 
    if(p === undefined) p = 1;
    if (!/^[1-9]\d*$/.test(limit) || !/^[1-9]\d*$/.test(p)){
        return Promise.reject({status: 400, msg: "400: Bad Request"})
    }
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
        if (sort_by === "comment_count"){
        queryStr += ` ORDER BY ${sort_by} ${order}`
        }else{
        queryStr += ` ORDER BY articles.${sort_by} ${order}`
        }
    } else{
        queryStr += ` ORDER BY articles.created_at ${order}`
    }


    const offset = (p-1) * limit

    queryStr += ` LIMIT ${limit} OFFSET ${offset} `
    
    return db.query(queryStr, queryArray)
    .then(async ({rows}) =>  {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "404: page not found"})
        }        
        const total_count =  await getArticleCount(topic_query)

        return {articles: rows , total_count}
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

exports.createArticle = (author, title, body, topic, article_img_url) => {
    if(!article_img_url){
        article_img_url = 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
    }
    return db.query(`
    INSERT INTO articles (title, topic, author, body, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`, [title, topic, author,body, article_img_url]).then(({rows}) => {
        rows[0].comment_count = 0
        return rows[0]
    })

}

exports.removeArticle = (article_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE article_id = $1`, [article_id]).then(() => {
        return db.query(`
        DELETE FROM articles
        WHERE article_id = $1
        RETURNING *`, [article_id])
    }).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: article not found"})
        }
    })

}