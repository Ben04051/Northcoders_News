const db = require("./db/connection")

exports.checkTopicExists = (topic) => {
    return db.query(`SELECT * FROM articles WHERE topic = $1`, [topic])
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: "404: topic not found"})
        }
    })
}

exports.getAllColumnNames = (table) => {
    return db.query( `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1;
  `, [table]).then(({rows}) => {
    const columnNames = rows.map((column) => {
        const {column_name} = column
        return column_name
    })

    return columnNames

  })


}

