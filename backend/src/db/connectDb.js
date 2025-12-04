import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const connectDb = async () =>{
    try {
       const connection =  await mongoose.connect(`${process.env.MONGODB_URI}/resume-builder `).then(()=>{
        console.log('Mongodb connected successfully');
        
       })
    } catch (error) {
        console.log("Mongodb connection error", error);
        
        
    }

}

export default connectDb