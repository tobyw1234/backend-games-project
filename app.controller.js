const { fetchCategories, fetchReviewById } = require("./app.model")



exports.getCategories = (req, res) => {
    fetchCategories().then((categories) => {
        res.status(200).send({categories})
    })
}

exports.getReviewById = (req, res, next) => {
    const review_id = req.params.review_id
     fetchReviewById(review_id).then((reviews) => {
        res.status(200).send({reviews})
     }).catch((err) => {
         next(err);
    })
}
