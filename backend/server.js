const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRouter = require("./routes/auth.routes");
const destRouter = require("./routes/destinations.routes");

const mongoUri = process.env.MONGO_URI;

mongoose
	.connect(mongoUri)
	.then(() => {
		console.log("connected to mongo");
	})
	.catch((err) => {
		console.log(err);
	});

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/dest", destRouter);

const port = process.env.PORT | 3000;

app.listen(port, () => {
	console.log(`server listening on ${port}`);
});
