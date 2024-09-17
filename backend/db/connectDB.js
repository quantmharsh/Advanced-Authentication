import mongoose from "mongoose";
const connectDB= async()=>{
    try {
        console.log( "MONGO_URI" ,process.env.MONGO_URI)
        const conn= await mongoose.connect(process.env.MONGO_URI ,{});
        console.log(`MongoDb connected successflly ${conn.connection}`)
    } catch (error) {
        console.log("Unable to connect to database");
    }
}
export default connectDB;