const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const app = express();
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken");

app.use(cookieParser());    //this middleware used to parse the cookies to read its value
app.use(express.json());    //this middleware convert the json into javascript object for storing in database
const bcrypt = require("bcrypt");

//dns for connecting ton the mongoDB because of some error in node 24v.
dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");

//signUp API

app.post("/signup", async (req, res) => {
  try{
    //Data Validating
    validateSignUpData(req);
    //Encrypting passwor
    const { firstName , lastName , emailId , password}= req.body;
    const passwordHash = await bcrypt.hash(password,10);
    //creating a new instance for the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password : passwordHash,
  });
    await user.save();
    res.send("User added successfully....");
  } catch (err) {
    res.status(400).send("ERROR : "+ err.message);
  }
});

//login API

app.post("/login", async(req,res)=>{
  try{
    const {emailId,password} = req.body;
    const user = await User.findOne({emailId : emailId})
    if(!user){
      throw new Error("Invalid credential")
    }
    const isPasswordValid = await bcrypt.compare(password , user.password) //always return true and false
    if (isPasswordValid){
        //create jwt token
         
        const token = await jwt.sign({_id : user._id},"shubham5421");
        res.cookie("token",token);
      res.send("Login Successfull")
    }
    else {
      throw new Error("Invalid credential")
    }
  }
  catch(err){
    res.status(400).send("Error : "+ err.message);
  }
});

//Profile API

app.get("/profile",async(req,res)=>{
  try{
  const cookie = req.cookies;
  const { token } = cookie;
  if (!token){
    throw new Error("Invalid Token");
  }
  const decodeMessage = await jwt.verify(token ,"shubham5421")
  const { _id } = decodeMessage;
  const user = await User.findById(_id);
  if(!user){
    throw new Error("User not exist");
  }
  res.send(user);
  }
  catch(err){
    res.status(400).send("ERROR : "+ err.message);
  }
})

//finding one particular document from the collection
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User not found");
    }
    else {
      res.send(user);
    }
  }
  catch(err) {
    res.status(404).send("Somthing went wrong...")
  }
});

//Handlimg diplicates documents with findOne()

app.get("/dup", async(req,res)=>{
const userEmail = req.body.emailId;
try{
  const user = await User.findOne({emailId : userEmail});
      if (user.length === 0) {
      res.status(404).send("User not found");
    }
    else {
      res.send(user);
    }
  }
  catch(err) {
    res.status(404).send("Somthing went wrong...")
  }
});

//Feed API - GET/feed - Get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("User not found ");
    }
    else {
      res.send(user);
    }
  }
  catch(err) {
    res.status(404).send("Something went wrong");
  }
});

//Delete user API

app.delete("/user", async(req,res)=>{
const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete({_id:userId})
    //const user = await User.findByIdAndDelete(userId)      both will work
    res.send("User Deleted Successfully...")
}
  catch(err){
    res.status(404).send("Something went wrong...")
}
});

//Updating data with patch API

app.patch("/user/:userId", async(req,res)=>{
  const userId = req.params?.userId
  const data = req.body;

  try{

    const ALLOWED_UPDATES = [
      "gender",
      "about",
      "skill",
      "photoUrl",
      "firstName",
      "lastName",
      "age"
    ]
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
      if(!isUpdateAllowed){
        throw new Error("Update not allowed")
      }
      if(data?.skill.length>10){
        throw new Error("Skill must be less than 10")
      }
    const user = await User.findByIdAndUpdate({_id:userId} , 
      data , 
      {
        returnDocument : "before",
        runValidators: true
      });

    res.send("User updated successfully..")
  }
  catch(err){
    res.status(404).send("upadate failed : "+ err.message)
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection Successful..");
    app.listen(3000, () => {
      console.log("Server is listing on port 3000");
    });
  })
  .catch((err) => {
    console.log("Database Connection cannot be Established... ");
    console.error(err);
  })


