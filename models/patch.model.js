const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");




	exports.updateVotesByReviewID = (review_id, inc_votes) => {
		const isReview_idANum = parseInt(review_id);
		const isInc_VotesANum = parseInt(inc_votes);
		if (!isReview_idANum) {
		return Promise.reject({ status: 400, msg: "invalid id" });
	}
	if (!isInc_VotesANum) {
		return Promise.reject({ status: 400, msg: "invalid update" });
	}

	const updateReview = db.query(
		"UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING * ",
		[inc_votes, review_id]
	);

	return Promise.all([updateReview])
		.then(([updateReview]) => {
				if (!updateReview.rows.length) {
					return Promise.reject({ status: 404, msg: "invalid review" });
				}
						return updateReview.rows[0];

	})
}