const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");



exports.fetchCommentsbyReviewId = (review_id = 1) => {
    
   
    const isReview_idANum = parseInt(review_id);
    
    if (!isReview_idANum) {
        return Promise.reject({ status: 400, msg: "invalid id" });
    }
    const selectComments = db.query(`SELECT * FROM comments WHERE review_id = $1`, [review_id])
    const checkReviewExists = db
        .query(`SELECT * FROM REVIEWS where review_id = $1`, [review_id])
    return Promise.all([selectComments, checkReviewExists])
        .then(([selectComments, checkReviewExists]) => {
                       if (!checkReviewExists.rows.length) {
                return Promise.reject({
                    status: 404,
                    msg: "review not found",
                });
            }
            if (!selectComments.rows.length) {
                return Promise.reject({

                  status: 200,
                  msg: "This review has no comments",
                });
            };

            return selectComments.rows;
        });
};


exports.insertComment = (review_id, commentObj) => {
   
    const { username, body } = commentObj

    if (!username || !body) {
        return Promise.reject({
            status: 400,
            msg: "invalid update",
        });
    }
 
    
    return db.query(`INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [review_id, username, body,])
        .then(({rows}) => {
            return rows[0]
        })
  
}

