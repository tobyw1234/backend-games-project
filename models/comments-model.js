const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");


exports.fetchCommentsbyReviewId = (review_id) => {
    console.log("poo");

    const isReview_idANum = parseInt(review_id);
    if (!isReview_idANum) {
        return Promise.reject({ status: 400, msg: "invalid id" });
    }
    
};