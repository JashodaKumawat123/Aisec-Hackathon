const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const JwtHelper = require("../utils/jwtHelper");
const authWare = require("../middlewares/authWare");

const apiRouter = express();

const jwtHelper = new JwtHelper();

apiRouter.post("/signup", async (req, res) => {
	try {
		const { email, password, name, userType } = req.body;
		if (!name || !email || !password || !userType) {
			return res.status(400).json({
				err: "Required Fields Missing",
			});
		}

		// check if the email already exists
		const userExist = await User.findOne({
			email: email,
		});
		if (userExist) {
			return res.status(400).json({
				err: "The email is already used",
			});
		}
		const passwordHash = bcrypt.hashSync(password, 10);

		const userCreated = await User.create({
			name,
			email,
			passwordHash,
			userType,
		});

		const token = jwtHelper.sign({
			userId: userCreated._id,
			userType: userCreated.userType,
		});
		res.json({
			token,
			name: userCreated.name,
			userType: userCreated.userType,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err.message,
		});
	}
});

apiRouter.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				err: "Required Fields Missing",
			});
		}

		const user = await User.findOne({
			email: email,
		});

		if (!user) {
			return res.status(404).json({
				err: "User with email is not found",
			});
		}

		const validPass = bcrypt.compareSync(password, user.passwordHash);
		if (!validPass) {
			return res.status(401).json({
				err: "Invalid Password",
			});
		}

		// sign the token
		const token = jwtHelper.sign({
			userId: user._id,
			userType: user.userType,
		});

		return res.json({
			token,
			name: user.name,
			userType: user.userType,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err.message,
		});
	}
});

apiRouter.get("/profile", authWare, async (req, res) => {
	try {
		const user = req.user;
		if (user == "public") {
			return res.json({
				name: "public",
				userType: "public",
			});
		}

		const userRes = await User.findById(user);

		res.json(userRes);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err.message,
		});
	}
});

module.exports = apiRouter;
