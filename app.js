const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories-controller.js");
const { getAllUsers } = require("./controllers/users-controller")
const {
	getReviewById,
	patchVotesByReviewId,
	getAllReviews,
} = require("./controllers/reviews-controller");
const { getCommentsByReviewId, postComment } = require("./controllers/comments-controller");
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/users", getAllUsers);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.patch("/api/reviews/:review_id", patchVotesByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);




app.all("/*", (req, res) => {
	res.status(404).send("Route not found" );
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({msg:"invalid user"});
  } else {next(err);}
})

app
	.use((err, req, res, next) => {
    if (err.status === 404 || 400) {
					res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  })
  



app.use((err, req, res, next) => {
	console.log(err);

	res.sendStatus(500);
});

module.exports = app; 

