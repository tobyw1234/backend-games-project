const {fetchCommentsbyReviewId} = require("../models/comments-model")



exports.getCommentsByReviewId = (req, res, next) => {
	const review_id = req.params.review_id
	fetchCommentsbyReviewId(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};