const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest= require("../models/ConnectionRequest")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res) => {
try{
  const fromUserId = req.user._id;
  const toUserId = req.params.toUserId;
  const status = req.params.status;

//this api is only for ignore and interested 
  const allowedStatus = ["ignored","interested"]
  if(!allowedStatus.includes(status)){
    return res.status(400).json({
      message : "Invalid status type " + status
    });
  }

//If there is existing ConnectionRequest
  const existingConnectionRequest = await ConnectionRequest.findOne({
    $or: [
      {fromUserId,toUserId},
      {fromUserId : toUserId, toUserId : fromUserId}
    ],
  });
  if(existingConnectionRequest){
    return res.status(400).send({message : "Connection already exist"})
  }
  const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status
  });
  const data = await connectionRequest.save();
  res.json({
    message  :("connected"),
    data,
  })
}
catch(err){
  res.status(400).send("ERROR : "+ err.message);
}
})

module.exports = requestRouter;