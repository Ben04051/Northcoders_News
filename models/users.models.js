const db = require("../db/connection")

exports.retrieveAllUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows
    })
}