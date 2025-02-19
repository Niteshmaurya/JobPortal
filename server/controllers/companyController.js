import Company from "../models/Company.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"

// register a new company

export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body

    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({
            success: false,
            message: "missing details"
        })
    }

    try {
        const companyExists = await Company.findOne({ email })

        if (companyExists) {
            return res.json({
                success: false,
                message: 'Company already registered'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id)
        })


    }
    catch (err) {
        res.json({ success: false, message: err.message })
    }



}

// company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body
    try {
        const company = await Company.findOne({ email })

        if (await bcrypt.compare(password, company.password)) {

            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })

        }
        else {
            res.json({
                success: false,
                message: "invalid email or password"
            })
        }
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }

}

// get company data
export const getCompanyData = async (req, res) => {


    try {
        const company = req.company
        res.json({
            success: true,
            company
        })
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }

}


// Post a new job

export const postJob = async (req, res) => {

    const { title, salary, description, location, level, category } = req.body

    const companyId = req.company._id

    // console.log(companyId, { title, salary, description, location })  working 

    try {

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()

        res.json({
            success: true,
            newJob
        })


    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }


}

// Get company job applicants
export const getCompanyJobApplicants = async (req, res) => {

}

// get company posted Jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {


        const companyId = req.company._id
        const jobs = await Job.find({ companyId })

        // Adding no. of applicants info in data
        const jobsData = await Promise.all(jobs.map(async (job) => {
            const applicants = await JobApplication.find({ jobId: job._id })
            return { ...job.toObject(), applicants: applicants.length }

        }))


        res.json({
            success: true,
            jobsData
        })


    } catch (error) {

        res.json({
            success: false,
            message: error.message
        })
    }
}

// change Job Application Status
export const ChangeJobApplicationsStatus = async (req, res) => {

}

// change job visiblity
export const changeVisiblity = async (req, res) => {
    try {

        const { id } = req.body

        const companyId = req.company._id
        const job = await Job.findById(id)

        if (companyId.toString() === companyId.toString()) {
            job.visible = !job.visible
        }
        await job.save();

        res.json({
            success: true,
            job
        })

    } catch (error) {
        res.json({
            success: false,
            message: err.message
        })
    }
}

