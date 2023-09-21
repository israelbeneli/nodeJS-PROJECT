const jwt = require("jsonwebtoken");
const config = require("config")
const {User} = require("../models/User")
const {Card} = require("../models/Card")
const logger = require("../logs/logger")
function authMW(...roles){
    return async (req,res,next)=>{ 
            const token = req.header("x-auth-token");
             if(!token){
                res.status(401).send("access denied . No token");
                logger.error("access denied . No token")
            }
            try{
                const decode = jwt.decode(token,config.get("auth.JWT_SECRET"));
                req.user = decode;
                if(roles.includes("isAdmin")){
                    if(req.user.isAdmin){
                        next();
                        return;
                    }
                }
                if(roles.includes("isBusiness")){
                    if(req.user.isBusiness){
                        next();
                        return;
                    }
                }
                if(roles.includes("curentUser")){
                    if(String(req.user._id)===req.params.id){
                        next(); 
                        return;
                    }
                } 
                if(roles.includes("cardOwner")){
                    const card = Card.findOne({user_id:req.user._id,
                    _id:req.params.id});
                    if (card){
                        next();
                        return;
                    }
                }
                if(roles.length===0){
                    next();
                    return;
                }
                res.status(404).send(`to user not have a ${roles} permissions`)
                logger.error(`to user not have a ${roles} permissions`)
            }catch{
                res.status(400).send("Invalid Token")
                logger.error("Invalid Token")
                return;
            }
    }
}
module.exports = {authMW};