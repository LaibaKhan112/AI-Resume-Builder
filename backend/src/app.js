import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import resumeRouter from './routes/resume.route.js'
import aiRouter from './routes/ai.route.js'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
   origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://ai-resume-builder-h7fq.onrender.com"],// your frontend URL
   credentials: true,                // allow cookies/token headers
}));

app.use('/api/user', userRouter)
app.use('/api/resume', resumeRouter)
app.use('/api/ai', aiRouter)

app.get('/', (req,res)=>{
    res.send("server is live")
})

export {app}