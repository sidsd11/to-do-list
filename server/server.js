import express from "express";
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoutes.js";

const app = express()
const port = process.env.PORT || 3000
connectDB()

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://hecpune.com', 'https://hecpune.com']

app.use(cors({origin: allowedOrigins, credentials: true}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

app.use('/api/user', userRouter)