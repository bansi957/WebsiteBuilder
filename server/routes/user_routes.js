const express=require("express")
const auth_middleware = require("../middleware/auth_middleware")
const getCurrentUSer = require("../controller/user_controller")


const userRouter=express.Router()


userRouter.get("/get-current-user",auth_middleware,getCurrentUSer)

module.exports=userRouter