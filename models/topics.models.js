const db = require("../db/connection")

exports.retrieveAllTopics = () => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics.rows
    })
}