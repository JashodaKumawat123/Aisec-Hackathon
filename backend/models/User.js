const mongoose = require("mongoose");

const visitedLocations = new mongoose.Schema({
	lat: Number,
	long: Number,
	name: String,
	locationId: String,
	visitCount: Number,
	lastVisited: Date,
});

const rewardHistorySchema = new mongoose.Schema({
	reward: Number,
	createdAt: { type: Date, default: Date.now },
	type: {
		type: String,
		enum: ["visit", "pin", "pin_visited_by_others"],
	},
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
	rewards: {
		type: Number,
		default: 0,
	},
	rewardHistory: {
		type: [rewardHistorySchema],
		default: [],
	},
});

const User = mongoose.model("User", schema);

module.exports = User;
