const {retrieveAllTopics, addNewTopic} = require("../models/topics.models")

exports.getAllTopics = (req, res, next) => {
    return retrieveAllTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch((err) => {
    next(err)
    })
}

exports.postNewTopic = (req, res, next) => {
    const {slug, description} = req.body
    return addNewTopic(slug, description).then((topic) => {
        res.status(201).send({topic})
    }).catch((err) => {
    next(err)
    })
}