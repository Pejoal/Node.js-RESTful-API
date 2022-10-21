const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		minLength: 3,
		type: String,
		unique: true,
		required: true,
	},

	email: {
		type: String,
		unique: true,
		required: true,
		validate: {
			validator: (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email),
			message: (props) => `${props.value} is not an valid email`,
		},
	},

	password: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		immutable: true, // unchangeable
		default: () => Date.now(),
	},

	updatedAt: {
		type: Date,
		default: () => Date.now(),
	},

	refreshToken: String
});

// Middleware
userSchema.pre("save", function (next) {
	this.updatedAt = Date.now();
	next();
});

module.exports = mongoose.model("User", userSchema);
