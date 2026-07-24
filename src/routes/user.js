const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest= require("../models/ConnectionRequest");

//get all the pending connection request

userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
try{
  const loggedInUser = req.user;

  const connectionRequests = await ConnectionRequest.find({
    toUserId : loggedInUser._id,
    status : "interested",
  }).populate("fromUserId",["firstName","lastName"]);
  
  res.json({
    message : "Data fetched successfully",
    data : connectionRequests,
  });
}
catch(err){
  res.status(500).send("ERROR "+ err.message)
}
})

userRouter.get("/user/requests/")

module.exports = userRouter;
