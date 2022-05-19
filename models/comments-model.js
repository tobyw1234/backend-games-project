const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");



exports.fetchCommentsbyReviewId = (review_id = 1) => {
   
    const isReview_idANum = parseInt(review_id);
    
    if (!isReview_idANum) {
        return Promise.reject({ status: 400, msg: "invalid id" });
    }
    return db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
        .then((comments) => {
            if (!comments.rows.length) {
                return Promise.reject({
                    status: 200,
                    msg: "This review has no comments",
                });
            };
            return comments.rows;
        });
};


exports.insertComment = (review_id, commentObj) => {
    const { username, body } = commentObj
       const created_at = Date.now(1)
    const votes = 0
   console.log("model before sql", username,body,review_id, created_at, votes)
    return db.query(`INSERT INTO comments (review_id, author, body, votes, created_at) VALUES ($1, $2, $3, $3, $5) RETURNING *;`, [review_id, username, body, votes, created_at])
        .then((comment) => {
            console.log("model after sql")
            console.log(comment.rows)
            return comment.rows
        })
}
