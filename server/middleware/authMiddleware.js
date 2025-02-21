import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import express from 'express'


const app = express()



export const protectCompany = async (req, res, next) => {

    const token = req.headers.token

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, login again'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("this is decoded data from authMiddleware protect company " + decoded)

        req.company = await Company.findById(decoded.id).select('-password')

        if (!req.company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            })
        }

        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message || 'Token verification failed'
        })
    }
}
