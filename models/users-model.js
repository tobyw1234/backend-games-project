const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");

exports.fetchAllUsers = () => {
	return db.query(`SELECT * FROM users`).then((users) => {
		return users.rows;
	});
};
