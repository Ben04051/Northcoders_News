const express = require("express")
const {handleIncorrectPath} = require("./controllers/endpoint.controllers") 
const apiRouter = require('./routes/api-router')

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.all('*', handleIncorrectPath)

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({msg: err.msg})
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    if (err.code === "23503") {
        const {constraint} = err
        const errorValue = constraint.match(/(?<=_)(.*)(?=_)/g)
        res.status(404).send({msg: `404: ${errorValue} not found`})
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502" || err.code === "42601" || err.status === 400 || err.code === "2201W" || err.code === "42703" || err.code === "2201X") {
        res.status(400).send({msg: 'Bad request'})
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    if (err.code === "23505") {
        const {detail} = err
        const errorValue = detail.match(/(?<=\()(.*)(?=\)=)/g)
        res.status(409).send({msg: `409: ${errorValue} already in use`})
    } else {
        next(err)
    }
})
app.use((err, req, res, next) => {
    res.status(500).send({msg: "developer error"})
})

// /(?<=\()(.*)(?=\)=)/

module.exports = app