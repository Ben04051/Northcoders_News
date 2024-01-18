const {retrieveAllUsers, retrieveUser} = require("../models/users.models")

exports.getAllUsers = (req,res,next) => {
    return retrieveAllUsers().then((users) => {
        res.status(200).send({users})
    })
}

exports.getUser = (req,res,next) => {
    const {username} = req.params
    return retrieveUser(username).then((user) => {
        res.status(200).send({user})
    }).catch((err) =>{ 
        next(err)
    })
}