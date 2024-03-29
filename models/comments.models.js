const db = require("../db/connection")

exports.retrieveArticleComments = (article_id, limit, p) => {
    
    if(limit === undefined) limit = 10; 
    if(p === undefined) p = 1 ;
    if (!/^[1-9]\d*$/.test(limit) || !/^[1-9]\d*$/.test(p)){
        return Promise.reject({status: 400, msg: "400: Bad Request"})
    }

return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
.then(({rows}) => {
    if(rows.length === 0){
        return Promise.reject({status: 404, msg: "404: article not found"})
    }

    const offset = (p-1) * limit

    return db.query(`SELECT * FROM comments
                        WHERE article_id = $1
                        ORDER BY created_at DESC
                        LIMIT ${limit} OFFSET ${offset}
                        `, [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: comments not found"})
        }
        return rows
    })
    })

}

exports.createComment = (username, body, article_id) => {
    return db.query(`
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *`, [body, article_id, username]).then(({rows}) => {
        return rows[0]
    })

}

exports.removeComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *`, [comment_id]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "404: comment not found"})
        }
    })

}

exports.changeCommentVotes = (comment_id, inc_votes) => {
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    `, [inc_votes, comment_id])
    .then(({rows}) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg:"404: comment not found"})
        }
        return rows[0]
    })
}

