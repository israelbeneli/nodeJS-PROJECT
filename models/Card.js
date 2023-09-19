const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlangth:2,
        maxlangth:255,
    },
    subtitle:{
        type:String,
        required:true,
        minlangth:2,
        maxlangth:255,
    },
    description:{
        type:String,
        required:true,
        minlangth:2,
        maxlangth:255,
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
    web:{
        type:String,
        required:true,
        minlangth:6,
        maxlangth:255,
        unique:true,
    },
    image:{
        url:{
            type: String,
            minlength: 11,
            maxlength: 1024,
            default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
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
        zip:{
            type:Number,
            minlangth:6,
            maxlangth:1024,
        },
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId(),
      },  
    },
    bizNumber:{
        type:Number,
        minlangth:1,
        maxlangth:1024,
        required:true
    },
    likes: [
        {
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    user_id:
        { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    createdAt:{
        type:Date,
        defaulte:Date.now,
    }
})
const Card = mongoose.model("Card", cardSchema, "cards");

function validateCard(card) {
  const schema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    email: Joi.string().min(6).max(255).required().email({ tlds: false }),
    web: Joi.string().min(11).max(1024).required(),
    image: Joi.object({
      url: Joi.string().min(11).max(1024),
      alt: Joi.string().min(6).max(255),
    }),
    address: Joi.object({
      state: Joi.string().allow(""),
      country: Joi.string().min(3).max(255).required(),
      city: Joi.string().min(6).max(255).required(),
      street: Joi.string().min(3).max(255).required(),
      houseNumber: Joi.string().min(1).max(10).required(),
      zip: Joi.string().min(0).max(12),
    }).required(),
  });

  return schema.validate(card);
}

async function generateBizNumber() {
  while (true) {
    const randomNumber = _.random(1000, 999_999_999);
    const card = await Card.findOne({ bizNumber: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  }
}

module.exports = { Card, validateCard, generateBizNumber };
