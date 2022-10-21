require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { ObjectId } = require("mongodb");

const register = async (req, res) => {
	try {
		if (req.body.password.length < 8) {
			res.status(401).json({ msg: `password length must be greater than 8` });
			return;
		}
		// if (await User.findOne({ email: req.body.email }) || await User.findOne({ username: req.body.username })) {
		if (await User.findOne({ email: req.body.email })) {
			res.json({ msg: "user already existed" });
		}
		await User.create({
			...req.body,
			password: await bcrypt.hash(req.body.password, 10),
		});
		res.status(201).json({ msg: `User Created` });
	} catch (err) {
		res.json(err.errors);
	}
};

const login = async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		res.status(404).json({ error: "User not found" });
		return;
	}
	if (!(await bcrypt.compare(req.body.password, user.password))) {
		res.status(404).json({ error: "Wrong Credentials" });
		return;
	}

	const accessToken = jwt.sign(
		user ,
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "60s",
		}
	);

	const refreshToken = jwt.sign(
		user ,
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "1d",
		}
	);

	// Saving refreshToken with current user
	user.refreshToken = refreshToken;
	await user.save();

	// Creates Secure Cookie with refresh token
	res.cookie("jwt", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "None",
		maxAge: 24 * 60 * 60 * 1000,
	});

	res.json({ user, access_token: accessToken });
};

const refresh = async (req, res) => {
	const cookies = req.cookies;
	// console.log(cookies);
	if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized
	const refreshToken = cookies.jwt;
	// console.log(refreshToken);
	const foundUser = await User.findOne({ refreshToken });
	// console.log(foundUser);
	if (!foundUser) return res.sendStatus(403); // Forbidden
	// evaluate jwt
	jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
		if (err || foundUser.username !== decoded.username)
			return res.sendStatus(403);
		const accessToken = jwt.sign(
			{ foundUser },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "60s" }
		);
		res.json({ accessToken });
	});
};

const logout = async (req, res) => {
	// On client, also delete the accessToken
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); // No content
	const refreshToken = cookies.jwt;

	// Is refreshToken in db?
	const foundUser = await User.findOne({ refreshToken });
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
		return res.sendStatus(204);
	}

	// Delete refreshToken in db
	foundUser.refreshToken = "";
	await foundUser.save();
	// console.log(result);

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.sendStatus(204).json({msg: "Logged Out"});
};

module.exports = { register, login, refresh, logout };
