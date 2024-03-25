const express = require("express");
const bodyParser = require("body-parser");
// const connectDb = require("./config/dbConnect");
const router = require("./Routes/routes");
const cors = require("cors");
const path = require("path");

// connectDb();

const port = 5000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Serve static files from the upload/ directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/", router);

app.listen(port, () => {
  console.log(` app
       listening on port ${port}`);
});
