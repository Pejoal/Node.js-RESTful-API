const Book = require("../models/Book");
const { ObjectId } = require("mongodb");

const index = async (req, res) => {
	// res.json({ msg: "Index" });
	const data = await Book.find({});
	res.json(data);
};

const store = async (req, res) => {
	try {
		if (await User.findOne({ ISBN: req.body.ISBN })) {
			res.json({ msg: "Book already existed" });
		}
		await Book.create(req.body);
		res.status(201).json({ msg: `Store Complete` });
	} catch (err) {
		res.json(err.errors);
	}
};

const show = async (req, res) => {
	try {
		res.json(await Book.findOne({ _id: ObjectId(req.params.id) }));
	} catch (err) {
		res.status(404).json({ msg: "ID Not Found" });
	}
	// res.json({ msg: `Show ${req.params.id}` });
};

const update = async (req, res) => {
	try {
		const id = { _id: ObjectId(req.params.id) };
		await Book.updateOne(id, { $set: req.body });
		res.json({ msg: "Update Complete" });
	} catch (err) {
		res.json(err.errors);
	}
};

const destory = async (req, res) => {
	try {
		const id = { _id: ObjectId(req.params.id) };
		await Book.deleteOne(id);
		res.json({ msg: "Delete Compelete" });
	} catch (err) {
		res.status(404).json(err.errors);
	}
};

module.exports = { index, store, update, destory, show };
