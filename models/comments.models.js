const db = require("../db/connection")

exports.retrieveArticleComments = (article_id) => {

return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
.then(({rows}) => {
    if(rows.length === 0){
        return Promise.reject({status: 404, msg: "404: article not found"})
    }

    return db.query(`SELECT * FROM comments
                        WHERE article_id = $1
                        ORDER BY created_at DESC
                        `, [article_id])
    .then(({rows}) => {
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

