const mongoose = require("mongoose");
const validator = require("validator");

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
    validate (value){
      if(!validator.isStrongPassword(value)){
        throw new Error ("Enter strong password : "+value)
      }
    }
  },

  age : {
    type : Number,
    required : true,
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
    }
  },
  photoUrl : {
    type : String,
    validate (value){
      if (!validator.isURL(value)){
        throw new error ("Invalid error : "+ value)
      }
    }
  }
},
 {
    timestamps : true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;