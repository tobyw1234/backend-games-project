const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");

exports.fetchReviewById = (review_id = 1) => {
	const isReview_idANum = parseInt(review_id);

	if (!isReview_idANum) {
		return Promise.reject({ status: 400, msg: "invalid id" });
	} else {

		return db
			.query(
				`SELECT reviews.*, COUNT(comments.author)::INT AS comment_count  
            FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
												WHERE reviews.review_id = $1
											 GROUP BY reviews.review_id
            ORDER BY created_at DESC`, [review_id])
			.then((reviews) => {
				return reviews.rows[0];
			});
		
	}
}
	
	exports.checkReviewExists = (review_id) => {

		return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
			.then(({ rows }) => {
				if (!rows.length) {
					return Promise.reject({ status: 404, msg: "review does not exist" });
				} else return rows
			})
	}

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
			.query(
				`SELECT reviews.created_at, reviews.title, reviews.category, reviews.review_id, 
            reviews.owner, reviews.votes, COUNT(comments.author)::INT AS comment_count  
            FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id
            GROUP BY reviews.review_id
            ORDER BY created_at DESC`
			)
			.then((reviews) => {
				return reviews.rows;
			});
	};

