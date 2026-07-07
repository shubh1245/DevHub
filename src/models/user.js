const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt =require("bcrypt");

const userSchema = new mongoose.Schema({


  firstName : {
    type : String, 
    required : true,
    minLength : 3,
    maxLength : 50,
  },

  lastName : {
    type : String, 
  },

  emailId : {
    type : String, 
    required : true,
    unique : true,
    lowercase : true,
    trim : true,
    validate (value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid Error : "+ value)
      }
    }
  },

  password : {
    type : String,
    required : true,
  },

  age : {
    type : Number,
    min : 18,
  },

  gender : {
    type : String,
    validate (value){
      if(!["male","female","other"].includes(value)){
        throw new Error("Not a valid gender")
      }
    }
  },
  about : {
    type : String,
    default : "Dev is in search for someone here"
  },
  skill : {
    type : [String],
  },
  photoUrl :  {
    type : String,
    validate (value){
      if (!validator.isURL(value)){
        throw new Error ("Invalid URL : "+ value);
      }  //if
    }      //validate
  }    //photourl
},
 {
    timestamps : true
  }
);

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({_id : user._id},"shubham5421" , {
    expiresIn: "7d"
  });
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser , passwordHash);
  return isPasswordValid;

}

const User = mongoose.model("User", userSchema);
module.exports = User;