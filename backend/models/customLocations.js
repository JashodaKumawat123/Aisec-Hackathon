const mongoose = require("mongoose");
const schema = mongoose.Schema({
	name: String,
	lat: Number,
	long: Number,
	description: String,
	keywords: [String],
	pinnedByUser: String,
	visitCount: Number,
});
const CustomLocation = mongoose.model("CustomLocation", schema);

module.exports = CustomLocation;
