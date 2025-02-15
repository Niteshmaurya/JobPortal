import Company from "../models/Company.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js"

// register a new company

export const registerCompany = async (req, res) => {
    const { name, email, password } = req.body

    const imageFile = req.imageFile

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
                message: 'Company already exist'
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

}

// get company data
export const getCompanyData = async (req, res) => {

}


// Post a new job

export const postJob = async (req, res) => {

}

// Get company job applicants
export const getCompanyJobApplications = async (req, res) => {

}

// get company posted Jobs
export const getCompanyPostedJobs = async (req, res) => {

}

// change Job Application Status
export const ChangeJobApplicationStatus = async (req, res) => {

}

// change job visiblity
export const changeVisiblity = async (req, res) => {

}

