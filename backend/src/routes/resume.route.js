import express from 'express'
import { createResume, deleteResume, getResumeByPublicId, getUserResumeById, getUserResumes, updateResume } from '../controllers/resume.controller.js'
import protect from '../middlewares/auth.middleware.js'
import upload from '../config/multer.js'

const resumeRouter = express.Router()

resumeRouter.post('/create',protect, createResume)
resumeRouter.delete('/delete/:resumeId', protect, deleteResume)
resumeRouter.put('/update', upload.single('image'), protect, updateResume)
resumeRouter.get('/get/:resumeId',protect, getUserResumeById)
resumeRouter.get('/public/:resumeId', getResumeByPublicId)
resumeRouter.get('/user', protect, getUserResumes)

export default resumeRouter