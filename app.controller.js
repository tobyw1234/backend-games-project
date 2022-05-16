const { fetchCategories } = require("./app.model")



exports.getCategories = (req, res) => {
    fetchCategories().then((categories) => {
        res.status(200).send({categories})
    })
}