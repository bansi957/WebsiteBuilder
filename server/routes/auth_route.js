const express=require("express")
const { googleAuth, logout } = require("../controller/auth_controller")

const authRouter=express.Router()

authRouter.post("/googleauth",googleAuth)
authRouter.get("/logout",logout)


module.exports=authRouter