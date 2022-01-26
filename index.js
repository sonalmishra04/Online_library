const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");

dotenv.config();
app.use(express.json());
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoute);

const port = 3000;

//start server
app.listen(port, console.log("Server is running!"));
