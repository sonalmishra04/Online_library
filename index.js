const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const bookRoute = require("./routes/book");
const categoRoute = require("./routes/category");
const multer = require("multer"); //for uploading files
const path = require("path");

dotenv.config();
app.use(express.json());
//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(console.log("Database connected!"))
  .catch((err) => console.log(err));

//for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, "img.jpg");
  },
});

//upload file
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/book", bookRoute);
app.use("/api/category", categoRoute);
app.use("/images", express.static(path.join(__dirname, "/images")));
const port = 3000;

//start server
app.listen(port, console.log("Server is running!"));
