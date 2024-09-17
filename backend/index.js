import  express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js"


dotenv.config();

const app=express();
const port=process.env.PORT ||3000;

app.use(express.json({limit:"50mb"}))
connectDB();
app.use("/api/auth" ,authRoutes)

app.get("/" ,(req ,res)=>{
   res.send("Hello world  123 ")
})
app.listen( port ,()=>{
    console.log("app listening on port" , port)
})
