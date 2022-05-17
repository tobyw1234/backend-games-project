const express = require("express");
const app = express();
const { getCategories, getReviewById } = require("./app.controller.js");
    
app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res) => {
	res.status(404).send({ msg: "Route not found" });
});
app.use((err, req, res, next) => {
	if (err.status === 404 || 400) {
		res.status(err.status).send(err.msg)
	}
})

app.use((err, req, res, next) => {
	console.log(err);
	res.sendStatus(500);
});

module.exports = app; 

