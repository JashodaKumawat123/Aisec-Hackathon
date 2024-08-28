const mongoose = require("mongoose");

const visitedLocations = new mongoose.Schema({
	lat: Number,
	long: Number,
	name: String,
	locationId: String,
	visitCount: Number,
	lastVisited: Date,
});

const schema = mongoose.Schema({
	name: String,
	email: String,
	passwordHash: String,
	userType: {
		type: String,
		enum: ["casual", "handler", "visuallyImpaired"],
	}, // casual, handler, visuallyImpaired
	createdAt: { type: Date, default: Date.now },
	visitedLocations: {
		type: [visitedLocations],
		default: [],
	},
});

const User = mongoose.model("User", schema);

module.exports = User;
