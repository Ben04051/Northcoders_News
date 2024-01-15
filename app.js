const express = require("express")
const {getAllTopics} = require("./controllers/topics.controllers")
const {getEndpointDescriptions, handleIncorrectPath} = require("./controllers/endpoint.controllers") 

const app = express()

app.use(express.json())

app.get("/api", getEndpointDescriptions)

app.get("/api/topics", getAllTopics)

app.all('*', handleIncorrectPath)

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({msg: err.msg})
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    res.status(500).send({msg: "developer error"})
})



module.exports = app