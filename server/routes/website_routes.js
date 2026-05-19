const express=require("express")
const auth_middleware = require("../middleware/auth_middleware")
const {generateWebsite,getWebsiteById,getAllWebsites,changes} = require("../controller/website_controller")


const websiteRouter=express.Router()


websiteRouter.post("/generate",auth_middleware,generateWebsite)
websiteRouter.get("/get-by-id/:websiteId",auth_middleware,getWebsiteById)
websiteRouter.post("/update/:websiteId",auth_middleware,changes)
websiteRouter.get("/get-all",auth_middleware,getAllWebsites)
module.exports=websiteRouter