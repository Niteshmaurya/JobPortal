import express from 'express'
import { ChangeJobApplicationsStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

// Register a company
router.post('/register', upload.single('image'), registerCompany)

// Company login
router.post('/login', loginCompany)

// get company data
router.get('/company', protectCompany, getCompanyData)

// post a job
router.post('/post-job', protectCompany, postJob)

// get Applicants Data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants)

// get company job list
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// change Applications status
router.post('/change-status', protectCompany, ChangeJobApplicationsStatus)

// change application status
router.post('/change-visiblity', protectCompany, changeVisiblity)

export default router