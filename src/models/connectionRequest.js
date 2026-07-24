const mongoose = require("mongoose");
const User = require("./user");
const { equals } = require("validator");

const connectionRequestSchema = new mongoose.Schema({

  fromUserId : {
    type : mongoose.Schema.Types.ObjectId,
    ref:"User",
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

//compound index

connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

//.pre mongoose middleware

connectionRequestSchema.pre("save", function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports=ConnectionRequest;
