var express = require("express");
var app = express();
var db = require("./db");
var cors = require("cors");
var PollController = require("./controllers/pollController");

app.use(cors());
//localhost:3001/poll
app.use("/poll", PollController);

//localhost:3001*
app.all("*", (req, res) => {
  res.status(404).send("The resource you have requested does not exist.");
});




module.exports = app;
