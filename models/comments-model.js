const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");


exports.fetchCommentsbyReviewId = (review_id) => {
    const isReview_idANum = parseInt(review_id);
    if (!isReview_idANum) {
        return Promise.reject({ status: 400, msg: "invalid id" });
    }
    return db.query(`SELECT * FROM comments WHERE review_id = £1`, [review_id])
        .then((comments) => {
            console.log(comments.rows, "sdasd")
            return comments.rows
    })
};