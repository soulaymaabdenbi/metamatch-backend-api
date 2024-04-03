const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sessionRouter = require("./routes/sessions");
const matchRouter = require("./routes/match");
const forumRouter = require("./routes/forum");
const blogRouter = require("./routes/blog");

const corsMiddleware = require("./middlewares/cors");
const csvParser = require("csv-parser");
const cron = require("node-cron");

const { scrapeArticles } = require("./controllers/BlogController");
const {
  scrapeMatches,
  watchCSVFiles,
} = require("./controllers/matchController");

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

app.use("/blog", blogRouter);

watchCSVFiles();

cron.schedule("5 0 * * *", async () => {
  try {
    await scrapeArticles();

    console.log("Scraping triggered successfully");
  } catch (error) {
    console.error("Error occurred while triggering scraping:", error);
  }
});

cron.schedule("0 0 * * * ", async () => {
  try {
    await scrapeMatches();
    console.log("Scraping triggered successfully");
  } catch (error) {
    console.error("Error occurred while triggering scraping:", error);
  }
});

//startScrapingArticles();

const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const { generateRandomPassword, validatePassword } = require("./utils/helper");

dotenv.config();

app.use(cors());
app.use("/", authRoute);
app.use("/api/users", userRoute);

app.use("/test", (req, res) => {
  let password = generateRandomPassword();

  if (!validatePassword(password)) {
    return res.status(400).json({
      status: false,
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    });
  }
  return res.status(200).json({ status: true, password });
});
app.listen(process.env.PORT || 5000, () =>
  console.log(`app listen on port ${process.env.PORT}!`)
);
