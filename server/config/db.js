const mongoose=require("mongoose")

const db=async ()=>{
    try {
        await mongoose.connect(process.env.DB)
        console.log("succesfully Connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports=db