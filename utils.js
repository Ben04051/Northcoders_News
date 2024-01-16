const db = require("./db/connection")

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM articles WHERE topic = $1`, [topic])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "404: topic not found"})
        }
    })
}