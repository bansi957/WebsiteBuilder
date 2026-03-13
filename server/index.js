require("dotenv").config()
const express=require("express")
const db = require("./config/db")
const authRouter = require("./routes/auth_route")
const cookieParser = require("cookie-parser")
const app=express()
const cors=require("cors")
const userRouter = require("./routes/user_routes")
const port=process.env.PORT ||5000
app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.listen(port,()=>{
    db()
    console.log(`server Started at ${port}`)
})