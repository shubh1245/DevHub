const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
const app = express();
//dns for connecting ton the mongoDB because of some error in node 24v.
dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])
const User = require("./models/user");

app.use(express.json());    //this middleware convert the json into javascript object for storing in database

app.post("/signup", async (req, res) => {
  //creating a new instance for the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully....");
  } catch (err) {
    res.status(400).send("Error in saving the user" + err.message);
  }
});

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

app.patch("/user", async(req,res)=>{

  const userId = req.body.userId;
  const data = req.body;
  try{
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


