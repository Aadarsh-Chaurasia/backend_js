import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try{
        // mongoose.connect(url) will return a connection instance promise
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error){
        // This console log will let us know engine reached here.
        console.log("MONGODB connection error ", error)
        process.exit(1)
    }
}

export default connectDB