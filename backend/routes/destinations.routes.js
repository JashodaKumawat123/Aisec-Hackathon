const express = require("express");
const apiRouter = express.Router();
const authWare = require("../middlewares/authWare");
const customLocations = require("../models/customLocations");
const { addRewards } = require("../utils/addRewards");

const User = require("../models/User");

const maxRad = (lat1, lat2, lon1, lon2) => {
	lon1 = (lon1 * Math.PI) / 180;
	lon2 = (lon2 * Math.PI) / 180;
	lat1 = (lat1 * Math.PI) / 180;
	lat2 = (lat2 * Math.PI) / 180;

	let dlon = lon2 - lon1;
	let dlat = lat2 - lat1;
	let a =
		Math.pow(Math.sin(dlat / 2), 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

	let c = 2 * Math.asin(Math.sqrt(a));

	let r = 6371;

	return c * r;
};

// user pin a location
apiRouter.post("/pin", authWare, async (req, res) => {
	try {
		const { lat, long, name, description, keywords } = req.body;
		if (!lat || !long || !name || !description || !keywords) {
			return res.status(400).json({
				err: "Required Fields Missing",
			});
		}

		const user = req.user;

		// check if the location is already pinned
		const locationExist = await customLocations.findOne({
			lat: lat,
			long: long,
		});

		if (locationExist) {
			return res.status(400).json({
				err: "The location is already pinned",
			});
		}

		const locationPinned = await customLocations.create({
			lat,
			long,
			name,
			description,
			keywords,
			pinnedByUser: user,
		});

		// give rewards
		await addRewards(user, "pin");
		await addRewards(user, "visit");

		res.json({
			locationPinned,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err.message,
		});
	}
});

apiRouter.get("/visited", authWare, async (req, res) => {
	try {
		const { lat, long } = req.query;

		const user = req.user;

		// update the visit coutn
		const updateCnt = await customLocations.findOneAndUpdate(
			{
				lat: lat,
				long: long,
			},
			{
				$inc: { visitCount: 1 },
			},
			{
				new: true,
			},
		);

		// see if the user has already visited the place
		if (user == "public") {
			console.log("public");
			return res.json({
				updateCnt,
				visited: false,
			});
		}

		const userRes = await User.findById(user);
		console.log("userRes", userRes);
		const visited = userRes.visitedLocations.find((location) => {
			return location.lat == lat && location.long == long;
		});
		console.log("visited", visited);

		// give rewards
		// check the the last time the user visited the location
		// if the user has visited the location before, then do not give rewards
		if (!visited) {
			await addRewards(user, "visit");
			await addRewards(updateCnt.pinnedByUser, "pin_visited_by_others");
		}
		if (!visited) {
			userRes.visitedLocations.push({
				lat,
				long,
				name: updateCnt.name,
				locationId: updateCnt._id,
				visitedCount: 1,
				lastVisited: new Date(),
			});
			await userRes.save();
		}
		if (visited) {
			visited.visitedCount += 1;
			visited.lastVisited = new Date();
			await userRes.save();
		}

		return res.json({
			updateCnt,
			visited: !!visited,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err.message,
		});
	}
});

apiRouter.get("/nearby", authWare, async (req, res) => {
	try {
		const { lat, long, boundary } = req.query;

		if (!lat || !long || !boundary) {
			return res.status(400).json({
				err: "Required Fields Missing",
			});
		}

		const user = req.user;

		const locations = await customLocations.find();

		const nearbyLocations = locations.filter((location) => {
			const distance = maxRad(lat, location.lat, long, location.long);
			return distance <= boundary;
		});

		res.json({
			nearbyLocations,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			err: err.message,
		});
	}
});

module.exports = apiRouter;
