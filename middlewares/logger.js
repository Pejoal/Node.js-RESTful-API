const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logger = async (req, res, next) => {
	const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
	req = req.url + " " + req.method + " " + res.statusCode;
	const logItem = `${dateTime}\t${uuid()}\t${req}`;
	if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
		await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
	}

	fsPromises.appendFile(
		path.join(__dirname, "..", "logs", "myLogs.txt"),
		`${logItem}\n`
	);
	// console.log("Append Successfully");
	next();
};

module.exports = logger;
