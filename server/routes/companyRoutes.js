import express from 'express'
import { changeVisiblity, getCompanyData, getCompanyJobApplications, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js';

const router = express.Router();

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// get company data
router.get('/company', getCompanyData)

// post a job
router.post('/post-job', postJob)

// get Applicants Data of company
router.get('/applicants', getCompanyJobApplications)

// get company job list
router.get('/list-jobs', getCompanyPostedJobs)

// change application status
router.post('/change-visiblity', changeVisiblity)

export default router