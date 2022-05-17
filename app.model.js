const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("./db/connection");



exports.fetchCategories = () => {
			return db.query(`SELECT * FROM categories`).then((results) => {
		return results.rows;
	});
};




exports.fetchReviewById = (review_id = 1) => {
	const isReview_idANum = parseInt(review_id);
	if (!isReview_idANum) {
		return Promise.reject({ status: 400, msg: "invalid id" });
	}
	const reviews = db.query(`SELECT * FROM reviews WHERE review_id = $1`, [
		review_id,
	]);
	const commentCount = db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id]
	)
	return Promise.all([reviews, commentCount]).then(([reviews, commentCount]) => {
		if (!reviews.rows.length) {
			return Promise.reject({ status: 404, msg: "director not found" });
		}
	
		let reply = reviews.rows[0]
		reply.comment_count = commentCount.rows.length;
		
		
		return reply;
	});
};
