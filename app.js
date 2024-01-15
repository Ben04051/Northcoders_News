const express = require("express")
const {getAllTopics} = require("./controllers/topics.controllers")
const {getEndpointDescriptions} = require("./controllers/endpoint.controllers") 

const app = express()

app.use(express.json())

app.get("/api", getEndpointDescriptions)

app.get("/api/topics", getAllTopics)

app.use((err, req, res, next) => {
    res.status(500).send({msg: "developer error"})
})


module.exports = app