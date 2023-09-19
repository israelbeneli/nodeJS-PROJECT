
# My Card API

In this application you can send HTTP requests and receive responses according to your requests.


## Installation

run npm i in the project folder

```bash
  npm run i
```
after this you need to import the Database to your local Database or to work on atlas.
    
## Usage/Examples

we use a "pino" libery to create a logger file for all the error messages.

If the user enters an incorrect password 3 times. The user will be blocked for 15 minutes 


You can send requests according to the following tables and receive the answers in a match.

USERS Table
|METHOD | patch  |Autorization  |action |Return|
|:-----|:--------:|------:|------:|------:|
|POST|users/|all|register user|theuser|
|POST|/users/login |all|login|token|
|GET|/users|admin|get all users|arrey of users|
|GET|/users/:id |the registered user Or admin|get user|user|
|PUT|/users/:id |the registered user|edit user|user|
|PATCH|/users/:id |the registered user|change isBusiness status|user|
|DELETE|/users/:id|the registered user Or admin|delete user|Deleted User|


CARDS Table
|METHOD | patch  |Autorization  |action |Return|
|:-----|:--------:|------:|------:|------:|
|POST|/cards|Business user|create new cards|card|
|GET|/cards |all|get all cards|all cards in arrey|
|GET|/cards/my-cards|the registered user|get user's cards|arrey of users|
|GET|/cards/:id |all|get specipic card|card|
|PUT|/cards/:id |the card owner|edit card|card|
|PUT|/cards/changeBizNumber/:id|Admin|edit bizNum|card|
|PATCH|/cards/:id |the registered user|add to like|card|
|DELETE|/cards/:id|the card owner Or admin|delete card|Deleted card|





## The user's model looks like this
```
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
```



## The card's model looks like this


```bash
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
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
(you have a example file)

`MONGO_URI`=mongodb://127.0.0.1/myApi

`PORT`=3000

`JWT_SECRET`=your secret word

if you wont to work on atlas data-base take the string from atlas website and put it in `MONGO_URI`

## License

[MIT](https://choosealicense.com/licenses/mit/)

