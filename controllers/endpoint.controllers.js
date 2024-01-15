const {retrieveEndpointDescriptions} = require("../models/endpoint.models")

exports.getEndpointDescriptions = (req, res, next) => {

    return retrieveEndpointDescriptions().then((endpoints) => {
        res.status(200).send({endpoints})
    }).catch((err) => {
        console.log(err)
    next(err)
    })
}

exports.handleIncorrectPath = (req, res, next) => {
    return Promise.reject({status: 404, msg: "404: endpoint not found"}).then(() => {
    }).catch((err) => {
      next(err)
    })
}