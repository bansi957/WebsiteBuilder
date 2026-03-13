const express=require("express")
const auth_middleware = require("../middleware/auth_middleware")
const generateWebsite = require("../controller/website_controller")


const websiteRouter=express.Router()


websiteRouter.post("/generate",auth_middleware,generateWebsite)

module.exports=websiteRouter