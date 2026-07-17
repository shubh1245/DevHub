const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest= require("../models/ConnectionRequest");
const { connection } = require("mongoose");

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
    message  :(req.user.firstName + " " + status + " " + toUser.firstName),
    data,
  })
}
catch(err){
  res.status(400).send("ERROR : "+ err.message);
}
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
  try{
      const loggedInUser = req.user;
      const {status,requestId} = req.params;
  
      //validate status

      const allowedStatus = ["accepted","rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message : "Status not allowed"})
      }

      //finding connection request send

      const connectionRequest = await ConnectionRequest.findOne({
        _id : requestId,
        toUserId : loggedInUser._id,
        status : "interested"
      });
      if(!connectionRequest){
        return res.status(404).json({message : "Connection request not found"})
      }

      connectionRequest.status = status;   //after all the validation now we successfully changed the status
      const data = await connectionRequest.save();
      res.status(200).json({
        message : "Connection Request "+status,
        data,
      })

  }
  catch(err){
    res.status(400).send("ERROR : "+ err.message );
  }

})

module.exports = requestRouter;