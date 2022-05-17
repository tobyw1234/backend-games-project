const {fetchAllUsers} = require("../models/get.model") 

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
        .then((users) => {
        res.status(200).send({users})
        })

};