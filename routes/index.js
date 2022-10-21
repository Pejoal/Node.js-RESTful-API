const express = require("express");
const path = require("path");
const router = express.Router();
const logger = require("../middlewares/logger");
// Routers
const bookRouter = require("./book");
const authRouter = require("./auth");

// Cross Origin Resource Sharing
const cors = require("cors");
const corsOptions = require("../config/corsOptions");
const credentials = require("../middlewares/credentials");

router.use("/", logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
router.use(credentials);

// Cross Origin Resource Sharing
router.use(cors(corsOptions));

// router.get("/", middleware, (req, res) => {
router.get("^/$|/index(.html)?", (req, res) => {
	res.statusCode = 200;
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.use("/book", bookRouter);
router.use("/auth", authRouter);

router.all("/*", (req, res) => {
	res.statusCode = 404;
	res.sendFile(path.join(__dirname, "../views/404.html"));
});

module.exports = router;
