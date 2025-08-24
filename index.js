const express = require("express");
const app = express();

app.use("/about", (req, res, next) => {
  console.log("middleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("middleware 2", req.path);
  next();
});

app.get("/about", (req, res) => {
  res.send("server started");
});

app.listen(3000);
