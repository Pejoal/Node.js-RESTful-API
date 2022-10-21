require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const routes = require("./routes/index");

mongoose.connect(process.env.DATABASE_URI, {
	autoIndex: true,
});

// serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

app.use(routes);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
