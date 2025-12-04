import express from 'express'
import { getUserById, getUserResumes, loginHandler, registerHandler } from '../controllers/user.controller.js'
import protect from '../middlewares/auth.middleware.js'

const userRouter = express.Router()

userRouter.post("/register", registerHandler)
userRouter.post('/login', loginHandler)
userRouter.get("/data", protect,getUserById)
userRouter.get("/resumes",protect, getUserResumes)

export default userRouter