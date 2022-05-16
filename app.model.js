const { del } = require("express/lib/application");
const req = require("express/lib/request");
const db = require("./db/data/test-data/index");



exports.fetchCategories = () => {
	    console.log("cheese");
	return db.query(`SELECT * FROM categories `)
		.then((results) => {
    console.log(results.rows);
    return results.rows;
  });
};