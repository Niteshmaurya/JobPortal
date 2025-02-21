import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"


// get user data 
export const getUserData = async (req, res) => {

    const userId = req.auth?.userId   // this is string 
    console.log("this is userId L " + userId)


    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'User ID is missing from the request'
        });
    }

    try {
        const user = await User.findById(userId)
        console.log("this is user in try " + user)


        if (!user) {
            return res.json({
                success: false,
                message: 'user not found now'
            })
        }
        res.json({
            success: true,
            user
        })

    } catch (error) {
        res.json({
            success: false,
            message: "t " + error.message
        })
    }

}


// apply for a job
export const applyForJob = async (req, res) => {

    const { jobId } = req.body
    console.log("this is jobId in applyForJOb" + req.body)

    const userId = req.auth && req.auth.userId      // problamatic for now
    console.log("this is whole req.auth  " + req.auth)
    console.log("this is userId " + userId)
    try {
        const isAlreadyApplied = await JobApplication.find({ jobId, userId })


        if (isAlreadyApplied.length > 0) {
            return res.json({
                success: false,
                message: 'Already applied'
            })
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({
                success: false,
                message: "job not found"
            })
        }

        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        return res.json({
            success: true,
            message: "applied successfully"
        })



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }

}

// get user applied applications

export const getUserJobApplications = async (req, res) => {

    try {

        const userId = req.auth
        const application = await JobApplication.find(userId)
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        console.log("application " + application)


        if (!application) {
            return res.json({
                success: false,
                message: 'No job application found for this user'
            })
        }

        return res.json({
            success: true,
            application
        })



    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }

}

// update user profile (resume)
export const updateUserResume = async (req, res) => {

    try {

        const userId = req.auth.userId
        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        return res.json({
            success: true,
            message: "resume updated"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })

    }

}