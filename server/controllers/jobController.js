import Job from "../models/Job.js"




// get all jobs
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ visible: true })
            .populate({ path: 'companyId', select: "-password" })


        res.json({ success: true, jobs })
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }

}

// get a single job by id
export const getJobById = async (req, res) => {
    try {

        const { id } = req.params

        const job = await Job.findById(id)
            .populate({
                path: 'companyId',
                select: '-password'
            })


        if (!job) {
            return res.json({
                success: false,
                message: 'job not found'
            })
        }
        res.json({
            success: true,
            job
        })
    }
    catch (err) {
        res.json({
            success: false,
            message: err.message
        })
    }

}