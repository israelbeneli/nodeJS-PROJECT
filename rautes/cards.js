const rauter = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const {Card, validateCard, generateBizNumber} = require("../models/Card")
const {authMW} = require("../middleware/auth");
const Joi = require("joi");
const logger = require("../logs/logger")
// GET cards/ 
rauter.get("/",async (req,res)=>{
    const cards = await Card.find({});
    if (cards.length===0){
        res.status(404).send("no card in system");
        logger.error("no card in system")
        return;
    }
    res.send(cards);
})
// GET cards/mycards . only the curent user
rauter.get("/my-cards",authMW(),async (req,res)=>{
    try{
        const cards = await Card.find({user_id:req.user._id})
        if(cards.length===0){
            res.status(401).send("no card to this user");
            logger.error("no card to this user");
        }
        res.send(cards);
    }
    catch(err){
        res.status(400).send(err.message)
        logger.error(err.message)
    }
})
// GET cards/:id - show the card with specific id
rauter.get("/:id",async(req,res)=>{
    console.log(req.params.id)
    try{
        const card = await Card.findOne({_id:req.params.id});
        if (!card){
            res.status(400).send("card not Faund")
            logger.error("card not Faund")
        }
        res.send(card)
    }catch(err){
        res.status(404).send(err.message);
        logger.error(err.message);
    }
}) 
// POST cards - create new card . only business user
rauter.post("/",authMW("isBusiness"),async(req,res)=>{
    const {error} = validateCard(req.body)
    if (error){
        res.status(400).json(error.details[0].message)
        logger.error(error.details[0].message)
        return;
    }
    try{
        const card = new Card({...req.body,
            bizNumber:await generateBizNumber(),
            user_id:req.user._id});
            await card.save();
            res.send(card);
        }catch(err){
            res.status(400).send(err.message)
            logger.error(err.message)
        }
})
// PUT cards/:id - edit card. only the user create the card.
rauter.put("/:id",authMW("cardOwner"),async(req,res)=>{
    const {error} = validateCard(req.body)
    if (error){
        res.status(400).json(error.details[0].message)
        logger.error(error.details[0].message)
        return;
    }
    try{
        const card =await Card.findOneAndUpdate({_id:req.params.id},{...req.body},{new:true});
        
        res.send(card)
    }catch(err){
        res.status(400).send(err.message);
        logger.error(err.message)
    }
})
// PATCH cards/:id - add id of user to likes arrey. only the curent user
rauter.patch("/:id",authMW(),async(req,res)=>{
    const card =await Card.findOneAndUpdate({_id:req.params.id},{$push:{likes:{user_id:req.user._id}}},{new:true})
    if (!card){
        res.status(400).send("card not found");
        logger.error("card not found")
        return
    }
    res.send(card);
})
// DELETE cards/:id - delete card. only the card owner or the admin
rauter.delete("/:id",authMW("isAdmin","cardOwner"),async(req,res)=>{
    const card = Card.findOneAndDelete({_id:req.params.id});
    if (!card){
        res.status(400).send(`no card with ${req.params} number`)
        logger.error(`no card with ${req.params} number`)
        return;
    }
    res.send(card);
})
// PUT cards/changeBizNumber/:id. only admin
rauter.put("/changeBizNumber/:id",authMW("isAdmin"),async(req,res)=>{
const card = await Card.findOneAndUpdate({_id:req.params.id},{bizNumber:await generateBizNumber()},{new:true});
if (!card){
    res.status(400).send("no Card")
    logger.error("no card");
}
res.json(card);
})
module.exports=rauter;