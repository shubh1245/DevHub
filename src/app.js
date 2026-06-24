const express = require("express");
const app = express();
app.use("/test", (req,res) =>{
  res.send("Dashboard")
});
app.use("/home", (req,res) =>{
  res.send("Homepage")
});
app.listen(3000, () => {
console.log("Server is listing on port 3000");
});