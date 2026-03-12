const express=require("express")
const { googleAuth, logout } = require("../controller/auth_controller")

const authRouter=express.Router()

authRouter.post("/googleauth",googleAuth)
authRouter.post("/logout",logout)


module.exports=authRouter