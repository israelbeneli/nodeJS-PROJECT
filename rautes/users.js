const rauter = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const {User,ValidateUser} = require("../models/User")
const {authMW} = require("../middleware/auth");
const Joi = require("joi");
const logger = require("../logs/logger")
// POST /users 
rauter.post("/",async (req,res)=>{
    const {error} = ValidateUser(req.body);
if (error){
  res.status(400).json(error.details[0].message)
  logger.error(`Error message":${error.details[0].message}`);
  return;
}
let user = await User.findOne({email:req.body.email});
if (user){
  res.status(400).json("this email is exist");
  logger.error(`Error message :this email is exist`);
  return
}
user =new User(req.body);
user.password = await bcrypt.hash(user.password,12);
await user.save();
 res.send(user);
})
//POST user/login 
rauter.post("/login", async (req,res)=>{
  const {error} = ValidateAuth(req.body);
  if (error){
      res.status(400).json(error.details[0].message)
      logger.error(error.details[0].message)
      return;
  }
  const user = await User.findOne({email:req.body.email})
  if (!user){
      res.status(400).json("the email is invalid")
      logger.error("the email is invalid")
      return;
  }
    if(user.loginAttempts < 3){
      const isPasswordValid =  await bcrypt.compare(req.body.password,user.password);
      if (!isPasswordValid){
        user.loginAttempts++;
        await User.findOneAndUpdate({email:req.body.email},user);
        res.status(400).json("the Password is invalid")
        logger.error("the Password is invalid")
        return;
      } 
    }
    else{
      setTimeout(async()=>{
        user.loginAttempts=0;
        await User.findOneAndUpdate({email:req.body.email},user);
      },150000)
      res.status(400).send("Access is denied for 15 minets")
      return;
    }
  user.loginAttempts=0;
  await User.findOneAndUpdate({email:req.body.email},user);
  const token = user.generateAuthToken();
  res.send(token)

})
//GET user/:id admin accsess only or the current user
rauter.get("/:id",authMW("isAdmin","curentUser"),async(req,res)=>{
  try{  
      const user = await User.findOne({_id:req.params.id}); 
      if (user){
          res.json(user);                
          // return;     
      }
    }
  catch(error){
      res.status(404).send("user not Found");
    }
  }
);
//GET users/ admin accsess only
rauter.get("/",authMW("isAdmin"),async(req,res)=>{
  let users = await User.find({});
    res.send(users);
})
//PUT users/:id the current user
rauter.put("/:id",authMW("curentUser"),async(req,res)=>{
  const {error} = ValidateUser(req.body);
  if (error){
    res.status(400).json(error.details[0].message)
    return;
  }
  try{
      const user = await User.findOneAndUpdate({_id:req.params.id},{...req.body},{new:true});
  if(!user){
    res.status(404).send("No user with this ID")
    return;
  }
  res.send(user);
  }
  catch(err){
    res.status(404).send(err.message)
  }
})
//PATCH users/:id change the "isBusiness" . only the current user
rauter.patch("/:id",authMW("curentUser"),async(req,res)=>{
  try{
    const user = await User.findOne({_id:req.params.id});
    user.isAdmin=!user.isAdmin;
    await User.findOneAndUpdate({_id:req.params.id},user,{new:true})
    console.log(user);
    res.send(user);
  }
  catch{
    res.status(404).send("not exist")
  }
})
//DELETE users/:id delete the user. only the current user.
rauter.delete("/:id",authMW("isAdmin","curentUser"),async(req,res)=>{
  try{
    const user = await User.findOneAndDelete({_id:req.params.id});
    res.send(user);
  }
  catch{
    res.status(404).send("user not exist")
  }
})
function ValidateAuth(user){
  const schema = Joi.object({
      email:Joi.string().min(6).max(255).required().email(),
      password:Joi.string().min(6).max(1024).required(),
  })
  return schema.validate(user);
}
module.exports = rauter;