const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sessionRouter = require("./routes/sessions");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/sessions", sessionRouter);

app.use("/test", (req, res) => {
  res.status(200).json({ message: "Welcome to metamatch app" });
});
app.listen(process.env.PORT || 3000, () =>
  console.log(`app listen on port ${process.env.PORT}!`)
);
