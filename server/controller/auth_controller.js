const User = require("../model/user_model")
const jwt=require("jsonwebtoken")
const googleAuth=async (req,res)=>{
    try {
        const {name,email,avatar}=req.body
        if(!email){
            return res.status(400).json({message:"email is required"})
        }
        const user=await User.findOne({email})
        if(!user){
        user=await User.create({email,name,avatar})
        }
        const token=await jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        })
       

        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`googleAuth error${error}`})
    }
}


const logout=async (req,res)=>{
    try {
        return res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"strict"})
    } catch (error) {
        return res.status(500).json({message:`logout error${error}`})

    }
}
module.exports={googleAuth,logout}