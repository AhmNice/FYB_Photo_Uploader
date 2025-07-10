import express from 'express'
import upload from '../middleware/fileUploadMiddleware.js'
import { fileUpload } from '../controller/uploadFile.js'
export const uploadRoute = express.Router()
uploadRoute.post('/upload', upload, fileUpload);

