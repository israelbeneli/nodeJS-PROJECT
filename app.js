require("dotenv/config")
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const chalk = require("chalk");

const userRauter = require("./rautes/users");
const cardRauter = require("./rautes/cards");

const app = express();

app.use(cors());
app.use(morgan(`DATE: :date[web] ; METHOD: :method ; URL: :url ; STATUS: :status ; RESPONSE TIME: :response-time ms`));
app.use(express.json());
 
mongoose.connect(config.get("mongoDB.MONGO_URI"))
.then(()=>console.log(chalk.green.bold("connected to DB")))
.catch(()=>console.log(chalk.red.bold("the conection to DB is faild")))

app.use("/users",userRauter);
app.use("/cards",cardRauter);
app.use(express.static("public"));
app.all("*",(req,res)=>{
    res.status(404).send("page not found")
})

app.listen(config.get("server.PORT"),console.log(chalk.green.bold("connected to",config.get("server.PORT"))));