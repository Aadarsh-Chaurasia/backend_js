import connectDB from "./db/index.js";
import dotenv from "dotenv"
import {app} from "./app.js"
dotenv.config({
    path: './env'
})

// Connecting to DB
connectDB()
.then(() => {
    const port = process.env.PORT || 8000
    // Checking for error before listening for server.
    app.on("error", (err) =>{
        console.log('Error: ', err);
    })
    // Listening to Server
    app.listen(port, () => {
        console.log(`Server running at port: ${port}`);
    })
})
.catch((err) => {
    console.log('MONGO DB connection failed !!', err)
})
