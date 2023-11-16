const jwt = require('jsonwebtoken') 
module.exports.checkcompany = function(req,  res){
    const token = req.cookies.metrolite;
    jwt.verify(token, "secretkey", function(err, userInfo){
    if(err)
    {
        return res.status(403).json("Token in invalid!");
        
    }
     
      const company = userInfo['company']
      req.company = "Roofing Metrolite";
    })
    //return 0;
}
module.exports.verify = function(req,  res){
  const token = req.cookies.metrolite;
  // console.log(req.cookies);
  
  if(!token)
  {
    console.log("no token")
    // return 401;
    return res.status(401).json("Not logged in !");
    //res.status(401).json("Not logged in !");
    //return 1;
  }
  jwt.verify(token, "secretkey", function(err, userInfo){
  if(err)
  {
      // console.log('invalid toekn')
      // return 403;
       return res.status(403).json("Token in invalid!");
       
      //res.status(403).json("Invalid Token");
      //return 1;
  }
  const company = userInfo['company']
    
  req.company = company;
  //console.log(userInfo)
  })
  //return 0;
}