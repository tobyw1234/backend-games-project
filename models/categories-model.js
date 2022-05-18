const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("../db/connection");



exports.fetchCategories = () => {
			return db.query(`SELECT * FROM categories`).then((results) => {
		return results.rows;
	});
};





