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
    console.log(commentObj)
    const { username, body } = commentObj

    if (!username|| !body) {
      return Promise.reject({
        status: 400,
        msg: "invalid update",
      });
    }
    const checkAuthorExists = db.query(
      `SELECT * FROM users WHERE username= $1`,
      [username]);  
    
    const addComment = db.query(`INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [review_id, username, body,]);

    return Promise.all([checkAuthorExists, addComment]).then(
        ([checkAuthorExists, addComment]) => {
            console.log(checkAuthorExists.rows.length, "rows")
        if (!checkAuthorExists.rows.length) {
          return Promise.reject({
            status: 404,
            msg: "review not found",
          });
        }
        return addComment.rows;
      }
    );
}
