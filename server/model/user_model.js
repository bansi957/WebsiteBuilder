const mongoose=require("mongoose")


const userSchema=new mongoose.Schema({
    name:{
        type:String,
         required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    avatar:{
        type:String
    },
    credits:{
        type:Number,
        default:100,
        min:0
    },
    plan:{
        type:String,
        enum:["free","pro","enterprise"],
        default:"free"
    }
    

},{timeStamps:true})


const User=mongoose.model("User",userSchema)
module.exports=User