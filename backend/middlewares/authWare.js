const JwtHelper = require("../utils/jwtHelper");

const jwtHelper = new JwtHelper();

const authPassThrough = process.env.AUTH_PASS_THROUGH;
console.log(authPassThrough);

async function authWare(req, res, next) {
	if (authPassThrough) {
		req.user = "public";
		return next();
	}
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
