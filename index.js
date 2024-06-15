const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port = process.env.PORT || 8000;
const userRouter = require("./routes/userRoutes");
const bookRouter = require("./routes/bookRoutes");
const libraryRouter = require("./routes/libraryRoutes");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/library", libraryRouter);

app.use("/hello", (req, res) => {
  return res.json({ message: "Welcome to app" });
});

app.use("/*", (req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
