const adminAuth=(req,res,next)=>{
  console.log("Checking Authorization")
  const token="shubham";
  const ifAdminAuthorized=token==="shubham";
  if(!ifAdminAuthorized){
    res.status(401).send("Unauthorized Request")
  }
  else{
    next();
  }
};

module.exports={
  adminAuth,
};