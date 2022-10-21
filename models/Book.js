const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
	Title: {
		type: String,
		unique: true,
		required: true,
	},
	Description: {
		type: String,
		required: true,
	},
	ISBN: {
		type: Number,
		unique: true,
		required: true,
		min: 1000,
		max: 10000,
	},
});

module.exports = mongoose.model("Book", bookSchema);
