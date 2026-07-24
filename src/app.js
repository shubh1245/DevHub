const express = require("express");
const connectDB = require("./config/database");
const dns = require("dns");
dns.setServers([  //dns for connecting ton the mongoDB because of some error in node 24 version.
  '1.1.1.1',
  '8.8.8.8'
]);

const app = express();
const cookieParser = require("cookie-parser")

app.use(cookieParser());    //this middleware used to parse the cookies to read its value
app.use(express.json());    //this middleware convert the json into javascript object for storing in database

const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/request")
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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


