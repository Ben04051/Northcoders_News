const {retrieveEndpointDescriptions} = require("../models/endpoint.models")

exports.getEndpointDescriptions = (req, res, next) => {

    return retrieveEndpointDescriptions().then((endpoints) => {
        res.status(200).send(endpoints)
    }).catch((err) => {
        console.log(err, "error hit")
    next(err)
    })
}