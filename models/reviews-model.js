const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");

exports.fetchReviewById = (review_id = 1) => {
	const isReview_idANum = parseInt(review_id);
	if (!isReview_idANum) {
		return Promise.reject({ status: 400, msg: "invalid id" });
	}
	const reviews = db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
		review_id,
	]);
	const commentCount = db.query(`SELECT * FROM comments WHERE review_id = $1`, [
		review_id,
	]);
	return Promise.all([reviews, commentCount]).then(
		([reviews, commentCount]) => {
			if (!reviews.rows.length) {
				return Promise.reject({ status: 404, msg: "director not found" });
			}

			let reply = reviews.rows[0];
			reply.comment_count = commentCount.rows.length;

			return reply;
		}
	);
};

	exports.updateVotesByReviewID = (review_id, inc_votes) => {
		const isReview_idANum = parseInt(review_id);
		const isInc_VotesANum = parseInt(inc_votes);
		if (!isReview_idANum) {
			return Promise.reject({ status: 400, msg: "invalid id" });
		}
		if (!isInc_VotesANum || !inc_votes) {
			return Promise.reject({ status: 400, msg: "invalid update" });
		}

		const updateReview = db.query(
			"UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING * ",
			[inc_votes, review_id]
		);

		return Promise.all([updateReview]).then(([updateReview]) => {
			if (!updateReview.rows.length) {
				return Promise.reject({ status: 404, msg: "invalid review" });
			}
			return updateReview.rows[0];
		});
	};



exports.fetchAllReviews = () => {
	return db
		.query(`SELECT * FROM reviews ORDER BY created_at DESC`)
		.then((reviews) => {
			console.log(reviews.rows);
			return reviews.rows;
		});
};