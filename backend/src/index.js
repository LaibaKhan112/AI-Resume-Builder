import express from 'express'
import connectDb from "./db/connectDb.js";
import dotenv from 'dotenv'
dotenv.config()
import {app} from './app.js'
import userRouter from './routes/user.route.js';


// Connecting to Database
connectDb()



// Starting the server
app.listen(process.env.PORT, ()=>{
    console.log("Server is running successfully on Port :", process.env.PORT);
    
})