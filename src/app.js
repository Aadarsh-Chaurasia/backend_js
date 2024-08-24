import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

// app.use() is used for middlewares configurations.
app.use(cors({
    origin: process.env.CORS_ORIGIN,  // CORS to control which domains can access your API.
    Credentials: true    // Allows cookies and other credentials to be sent in cross-origin requests.
}))

// Limiting request body size
app.use(express.json({limit: "16kb"}))   // Body size limits to prevent excessively large requests.
app.use(express.urlencoded({extended: true, limit: '16kb'})) // To handle the incoming url that are encoded, eg. %20% instead of space.

app.use(express.static("public")) //  for serving files from the public directory to url.

app.use(cookieParser()) // Cookie parsing for handling cookies in requests

export { app }
