const JwtHelper = require("../utils/jwtHelper");

const jwtHelper = new JwtHelper();

async function authWare(req, res, next) {
	const token = req.headers["x-auth-token"];
	if (!token) {
		return res.status(401).json({
			err: "Token is missing",
		});
	}

	const payload = jwtHelper.verify(token);
	if (!payload) {
		return res.status(401).json({
			err: "Invalid token",
		});
	}

	req.user = payload.userId;
	next();
}

module.exports = authWare;
