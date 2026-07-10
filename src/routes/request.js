const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/request/send/in", userAuth, async(req,res) => {
try{

}
catch(err){

}
catch(err){

}
})

module.exports = requestRouter;