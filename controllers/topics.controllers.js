const {retrieveAllTopics} = require("../models/topics.models")

exports.getAllTopics = (req, res, next) => {

    return retrieveAllTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch((err) => {
    next(err)
    })
}