const endpoints = require("../endpoints.json")

exports.retrieveEndpointDescriptions = () => {
    return Promise.resolve(endpoints)
}