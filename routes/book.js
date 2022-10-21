const express = require("express");
const BookRouter = express.Router();
const BookController = require("../controllers/BookController");

// Auth Middleware
const auth = require("../middlewares/auth");

// built-in middleware to handle urlencoded form data
BookRouter.use(express.urlencoded({ extended: false }));

// built-in middleware for json
BookRouter.use(express.json());

BookRouter.route("/")
	.get(BookController.index)
	.post(auth, BookController.store);

// Middlewares must be first
BookRouter
	// .use(auth)
	.route("/:id")
	.get(BookController.show)
	.patch(auth, BookController.update)
	.put(auth, BookController.update)
	.delete(auth, BookController.destory);

module.exports = BookRouter;
