const jwt = require("jsonwebtoken");

class JwtHelper {
	constructor() {
		this.secret = process.env.JWT_SECRET;
	}

	sign(payload) {
		return jwt.sign(payload, this.secret);
	}
	verify(token) {
		try {
			return jwt.verify(token, this.secret);
		} catch (err) {
			return false;
		}
	}
}

module.exports = JwtHelper;
