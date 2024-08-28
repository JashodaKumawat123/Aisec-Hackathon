const express = require("express");
const apiRouter = express.Router();
const authWare = require("../middlewares/authWare");
const customLocations = require("../models/customLocations");

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
