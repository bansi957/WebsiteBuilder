require("dotenv").config()
const express=require("express")
const db = require("./config/db")
const authRouter = require("./routes/auth_route")
const cookieParser = require("cookie-parser")
const app=express()
const cors=require("cors")
const userRouter = require("./routes/user_routes")
const websiteRouter = require("./routes/website_routes")
const billingRouter = require("./routes/billing_route")
const { stripeWebhook } = require("./controller/billing_controller")
const port=process.env.PORT ||5000
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}
))
app.post("/api/billing/webhook", express.raw({ type: "application/json" }), stripeWebhook)
app.use(express.json())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)
app.use("/api/billing", billingRouter)

app.listen(port,()=>{
    db()
    console.log(`server Started at ${port}`)
})