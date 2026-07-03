const mongoose = require("mongoose");
const connectDB = async () => {
  await
    mongoose.connect(
      "mongodb+srv://shubhamyaduvanshi5421_db_user:shubham1245@namastenode.fgzrrhi.mongodb.net/devTinder"
    );
};
module.exports = connectDB;
