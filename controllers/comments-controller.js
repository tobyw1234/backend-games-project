const {
  fetchCommentsbyReviewId,
  insertComment,
  checkCommentExists,
  removeComment
} = require("../models/comments-model");
const {checkReviewExists} = require("../models/reviews-model")
 


exports.getCommentsByReviewId = (req, res, next) => {
  const review_id = req.params.review_id
  const isReview_idANum = parseInt(review_id);
  if (!isReview_idANum) {
    res.status(400).send({ msg: "invalid id" });
  }
  checkReviewExists(review_id)
    .then(() => {

      return fetchCommentsbyReviewId(review_id)
    })
    .then((comments) => {
			res.status(200).send({ comments });
		})
    .catch((err) => {
      next(err)
    });
};

exports.postComment = (req, res, next) => {
	const review_id = req.params.review_id
  const isReview_idANum = parseInt(review_id);
  if (!isReview_idANum) {
    res.status(400).send({ msg: "invalid id" });
  } else {
    const commentObj = req.body
    checkReviewExists(review_id)
  
      .then(() => {
        return insertComment(review_id, commentObj)
      })
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch((err) => {
     
        next(err);
      });
  }
}

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  console.log(req.params)
  const isComment_idANum = parseInt(comment_id);
  if (!isComment_idANum) {
    res.status(400).send({ msg: "invalid id" })
  } else {
        
    return removeComment(comment_id)
  
      .then((deleted) => {
        console.log(deleted)
        res.status(204).send()
      }).catch(next)
  
  }
}

