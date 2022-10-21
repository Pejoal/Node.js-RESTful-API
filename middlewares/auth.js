const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/User");
const auth = async (req, res, next) => {
	if (
		req.headers &&
		req.headers.authorization &&
		req.headers.authorization.split(" ")[1]
	) {
		const accessToken = req.headers.authorization.split(" ")[1];
		// console.log(accessToken);
		try {
			const decode = await jwt.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET
			);
			// console.log(decode);
			const user = await User.findOne({ _id: ObjectId(decode.foundUser._id) });
			if (!user) {
				res.status(401).json({ error: "Unauthorized" });
				return;
			}
			// if it reached here that means user and password are valid
			next();
		} catch (error) {
			// console.log(error);
			res.status(401).json({ error: "Unauthorized" });
		}
	}
};

module.exports = auth;
