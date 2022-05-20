const { del } = require("express/lib/application");
const req = require("express/lib/request");
const { get } = require("express/lib/response");
const { RowDescriptionMessage } = require("pg-protocol/dist/messages");
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







 const getCategory = () => {
	return db
    .query(`SELECT reviews.category FROM reviews GROUP BY reviews.category`)
    .then(({ rows }) => {
      const categories = rows.map((row) => {
        row = row.category;
        return row;
      });

      return rows;
    })

	}
	
	

	
exports.fetchAllReviews = (sort_by = "created_at", order = "desc", category) => {
  let validSort = [
    "created_at",
    "title",
    "review_id",
    "owner",
    "votes",
    "comment_count",
		];
	let validOrder = ["asc", "desc"];

	return getCategory()
    .then((rows) => {
      const categoryArr = rows.map((row) => {
        row = row.category;
        return row;
						});
					
					if (category) {
						const categorySpaces = category.replace("_", " ");
												if (!categoryArr.includes(categorySpaces)) {
							   return Promise.reject({ status: 404, msg: "invalid category" });
												} 
						}

      if (!validSort.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "invalid sort" });
						}
					
      if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "invalid order" });
      }

      let queryStr = `SELECT reviews.created_at, reviews.title, reviews.category, reviews.review_id, 
            reviews.owner, reviews.votes, COUNT(comments.author)::INT AS comment_count  
            FROM reviews  LEFT JOIN comments ON reviews.review_id = comments.review_id
            `;

      if (category) {
        const categorySpaces = category.replace("_", " ");

        queryStr += ` WHERE reviews.category = '${categorySpaces}' `;
      }

      queryStr += `GROUP BY reviews.review_id ORDER BY created_at ${order}`;

      return db.query(queryStr);
    })
    .then((reviews) => {
      return reviews.rows;
    });
}; 
	


