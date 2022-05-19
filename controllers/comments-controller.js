const {
  fetchCommentsbyReviewId,
  insertComment,
} = require("../models/comments-model");



exports.getCommentsByReviewId = (req, res, next) => {
	const review_id = req.params.review_id
	fetchCommentsbyReviewId(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postComment = (req, res, next) => {
	const review_id = req.params.review_id

	const commentObj = req.body

console.log("controller", review_id, commentObj)
	insertComment(review_id, commentObj)
		.then((comment) => {
			console.log(comment)
			res.status(201).send({ comment })
		}).catch(next);
			
}