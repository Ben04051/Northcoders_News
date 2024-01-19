const db = require("../db/connection")

exports.retrieveAllTopics = () => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics.rows
    })
}

exports.addNewTopic = (slug, description) => {
    return db.query(`
    INSERT INTO topics (slug, description) 
    VALUES ($1, $2)
    RETURNING *`, [slug, description]).then(({rows}) => {
        return rows[0]
        
    })
}