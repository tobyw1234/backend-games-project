const {
	fetchReviewById,
	fetchAllReviews,
	updateVotesByReviewID,
	checkReviewExists
} = require("../models/reviews-model");




exports.getReviewById = (req, res, next) => {
	const review_id = req.params.review_id;
	const isReview_idANum = parseInt(review_id);
	if (!isReview_idANum) {
		res.status(400).send({ msg: "invalid id"});
	}
	
	checkReviewExists(review_id)
		.then(() => {
			return fetchReviewById(review_id)
		})
		.then((reviews) => {

			res.status(200).send({ reviews });
		})
		.catch((err) => {
			next(err);
		});
};

exports.patchVotesByReviewId = (req, res, next) => {
	const { review_id } = req.params;
	const { inc_votes } = req.body;
		updateVotesByReviewID(review_id, inc_votes)
		.then((updatedReview) => {
			res.status(200).send({ review: updatedReview });
		})
		.catch(next);
}; 



exports.getAllReviews = (req, res, next) => {
	const { sort_by, order, category } = req.query
	fetchAllReviews(sort_by, order, category)
		.then((reviews) => {
	
			if (!reviews.length) {
				res.status(200).send({ reviews });

			} else {
				res.status(200).send({ reviews });
			}
			})
		.catch((err) => {
			next(err)
	
		});
}
