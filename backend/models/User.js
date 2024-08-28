const mongoose = require("mongoose");
const schema = mongoose.Schema({
	name: String,
	email: String,
	passwordHash: String,
	userType: {
		type: String,
		enum: ["casual", "handler", "visuallyImpaired"],
	}, // casual, handler, visuallyImpaired
	createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", schema);

module.exports = User;
