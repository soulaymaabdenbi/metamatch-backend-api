const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sessionRouter = require("./routes/sessions");
const matchRouter = require("./routes/match");
const forumRouter = require("./routes/forum");
const corsMiddleware = require("./middlewares/cors");
const csvParser = require("csv-parser");
const { startScrapingArticles } = require("./controllers/matchController");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
app.use(corsMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/sessions", sessionRouter);
app.use("/matches", matchRouter);
app.use("/forum", forumRouter);
//startScrapingArticles();
app.use("/test", (req, res) => {
  res.status(200).json({ message: "Welcome to metamatch app" });
});
app.listen(process.env.PORT || 3000, () =>
  console.log(`app listen on port ${process.env.PORT}!`)
);
