const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest= require("../models/ConnectionRequest");
const USER_SAFE_DATA = "firstName lastName age gender about skills"
const User = ("../models/user");
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


userRouter.get("/user/connections",userAuth,async(req,res)=>{
  try{
  const loggedInUser = req.user;
  const connectionRequests = await ConnectionRequest.find({
   $or : [
    {toUserId : loggedInUser._id,status : "accepted"},
    {fromUserId  : loggedInUser._id,status : "accepted"},
    ]
  }).populate("fromUserId",USER_SAFE_DATA)
  .populate("toUserId",USER_SAFE_DATA);

  const data = connectionRequests.map((row)=>{
    if(row.fromUserId._id.toString()===loggedInUser._id){
      return row.toUserId;
    }
    return row.fromUserId;
  });
  
  res.json({data});
}
catch(err){
  res.status(400).send({message : err.message});
}
});

userRouter.get("/feed",userAuth,async(req,res)=>{
  try{
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 5: limit;

    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or : [{fromUserId : loggedInUser._id},{toUserId : loggedInUser._id}],
    }).select("fromUserId toUserId").skip(skip).limit(limit);

    const hideUsersFromFeed=new Set();
    connectionRequests.forEach((req)=>{
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and : [
         {_id : { $nin  : Array.from()}},
         {_id : { $ne  : loggedInUser._id} },
      ]
    }).select(USER_SAFE_DATA);

      res.send(users);
  } catch(err){
    res.status(404).send({message : err.message});
  }
});

module.exports = userRouter;