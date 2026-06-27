const express = require("express");
const app = express();
const { adminAuth } = require("./middlewares/auth")

app.use("/admin",adminAuth);

//this won't get checked for authorization because /admin will only checked
app.get("/user",(req,res,next)=>{
  res.send("User data sent")
});

app.get("/admin/allData",(req,res)=>{
    res.send("All Data Sent");
  });

app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted a User");  
  });

app.listen(3000, () => {
  console.log("Server is listing on port 3000");
  });