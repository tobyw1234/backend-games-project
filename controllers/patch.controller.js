
const { updateVotesByReviewID } = require("../models/patch.model.js");

exports.patchVotesByReviewId = (req, res, next) => {
    const { review_id } = req.params
    const { inc_votes } = req.body;
    console.log(inc_votes)
    updateVotesByReviewID(review_id, inc_votes).then((updatedReview) => {

        res.status(200).send({review: updatedReview})

    }).catch(next)

    
} 
