const validator = require("validator");

const validateSignUpData = (req)=>{
  const {firstName , lastName , emailId , password } = req.body;

  if(!firstName || !lastName){
    throw new Error("Enter a valid first or last name ")
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("Enter a valid Email ID")
  }
 else if(!validator.isStrongPassword(password)){
    throw new Error("Please enter a strong password")
  }
}

const validateEditProfileData = (req)=>{
  const allowedEditFields = ["firstName","lastName","emailId","age","gender","about","skill","photoUrl"];
  const isEditAllowed = Object.keys(req.body).every((field)=>
     allowedEditFields.includes(field)
    );
    return isEditAllowed;
} 
module.exports ={
  validateSignUpData,
  validateEditProfileData
}