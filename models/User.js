const Joi = require("joi");
const mongoose = require("mongoose");
const jwt= require("jsonwebtoken");
const config = require("config");
const userschema = new mongoose.Schema({
    name:{
        first:{
            type:String,
            required:true,
            minlangth:2,
            maxlangth:255,
        },
        middle:{
            type:String,
            minlangth:2,
            maxlangth:255,
            default:"",
        },
        last:{
            type:String,
            required:true,
            minlangth:2,
            maxlangth:255,
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
      },

    },
    isBusiness:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    phone:{
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10,
      },
    email:{
        type:String,
        required:true,
        minlangth:6,
        maxlangth:255,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minlangth:6,
        maxlangth:1024,
    },
    address:{
        state:{
            type:String,
            minlangth:2,
            maxlangth:255,
        },
        country:{
            type:String,
            required:true,
            minlangth:2,
            maxlangth:255,
            default:"Israel"
        },
        city:{
            type:String,
            required:true,
            minlangth:2,
            maxlangth:255,
        },
        street:{
            type:String,
            required:true,
            minlangth:2,
            maxlangth:255,
        },
        houseNumber:{
            type:Number,
            minlangth:1,
            maxlangth:1024,
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
      },
    },
    image:{
        url:{
            type: String,
            minlength: 11,
            maxlength: 1024,
        },
        alt:{
            type:String,
            minlangth:2,
            maxlangth:255, 
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
        },
       
    },
    createdAt:{
        type:Date,
        defaulte:Date.now,
    },
    loginAttempts:{
        type:Number,
        default:0
    }
})

userschema.methods.generateAuthToken = function(){
    
    return(jwt.sign({_id:this._id , isBusiness:this.isBusiness,isAdmin:this.isAdmin},config.get("auth.JWT_SECRET")));
}
function ValidateUser(user){
    const schema = Joi.object({
        name:Joi.object({
            first:Joi.string().min(3).max(255).required(),
            middle:Joi.string().min(3).max(255),
            last:Joi.string().min(3).max(255).required(),
        }),
        isBusiness:Joi.boolean().default(false),
        isAdmin:Joi.boolean().default(false),
        phone:Joi.string().min(9).max(10).required().regex(/^0[2-9]\d{7,8}$/),
        email:Joi.string().min(6).max(255).required().email(),
        password:Joi.string().min(6).max(1024).required(),
        address:Joi.object({
            state:Joi.string().min(2).max(255),
            country:Joi.string().min(2).max(255).default("israel"),
            city:Joi.string().min(2).max(255).required(),
            street:Joi.string().min(2).max(255).required(),
            houseNumber:Joi.number().min(1).max(1024).required(),
        }),
        image:Joi.object({ 
            url: Joi.string().min(11).max(1024),
            alt: Joi.string().min(6).max(255),
        }),
    })
    return (schema.validate(user))
}
const User = mongoose.model("User",userschema,"users");
module.exports = {User,ValidateUser}