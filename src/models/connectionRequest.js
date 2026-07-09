const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema({

  fromUserId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  
  toUserId  : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },

  status : {
  type : String,
  required : true,
  enum : {
    values : ["ignored", "accepted" , "rejected", "interested"],
    message : `{VALUE} is incorrect status type`
  }
}
},
{
  timestamps : true 
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);
module.exports=ConnectionRequestModel;
