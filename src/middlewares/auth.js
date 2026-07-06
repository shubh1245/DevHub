const jwt = require("jsonwebtoken");
const User=require("..models/user");

const userAuth=(req,res,next)=>{
  try{
    const cookies = req.cookies;
    const { token } = cookies;
    if(!token){
      throw new Error ("Token is invalid");
    }
    const decodeObj = await jwt.verify(token,"shubham5421");
    const { _id } = decodeObj;

    const user = await User.findById(_id);
    if(!id){
      throw new Error("User not found");
    }
    req.user = user;
  next();
  }
  catch(err){
    res.status(400).send("ERROR : "+err.message);
  }
}
  

module.exports={
  userAuth,
};