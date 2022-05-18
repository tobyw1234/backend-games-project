const {fetchCommentsbyReviewId} = require("../models/comments-model")


console.log("abc");
exports.getCommentsByReviewId = (req, res, next) => {
	console.log("sdsada");

	const review_id = req.params;
	fetchCommentsbyReviewId(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};