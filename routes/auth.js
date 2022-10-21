const express = require("express");
const AuthRouter = express.Router();
const AuthController = require("../controllers/AuthController");
const cookieParser = require("cookie-parser");

// built-in middleware to handle urlencoded form data
AuthRouter.use(express.urlencoded({ extended: false }));

// built-in middleware for json
AuthRouter.use(express.json());

// middleware for cookies
AuthRouter.use(cookieParser());

AuthRouter.route("/register").post(AuthController.register);
AuthRouter.route("/login").post(AuthController.login);
AuthRouter.route("/refresh").post(AuthController.refresh);
AuthRouter.route("/logout").post(AuthController.logout);

module.exports = AuthRouter;
