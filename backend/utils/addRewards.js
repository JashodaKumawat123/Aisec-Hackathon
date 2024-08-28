const User = require("../models/User");

async function addRewards(userId, rewardType) {
	if (userId == "public") {
		return;
	}
	const user = await User.findById(userId);
	if (!user) {
		return;
	}

	// calculate the reward
	let reward = 0;
	switch (rewardType) {
		case "visit":
			reward = 10;
			break;
		case "pin":
			reward = 20;
			break;
		case "pin_visited_by_others":
			reward = 30;
			break;
	}

	const rewardHistory = {
		reward: reward,
		type: rewardType,
	};

	const currentRewardHistory = user.rewardHistory;
	const currentRewards = user.rewards;

	currentRewardHistory.push(rewardHistory);

	const res = await User.findByIdAndUpdate(userId, {
		rewardHistory: currentRewardHistory,
		rewards: currentRewards + reward,
	});

	return res;
}

module.exports = {
	addRewards,
};
