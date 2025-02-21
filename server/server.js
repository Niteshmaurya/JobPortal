import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoute.js'
import { clerkMiddleware } from '@clerk/express'




const app = express()
// import dotenv from 'dotenv';
// dotenv.config();


//  connect to db
await connectDb()
await connectCloudinary()
// console.log("web hook secret key " + process.env.CLERK_WEBHOOK_SECRET);

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())
// Use Clerk authentication middleware before your routes

app.get('/', (req, res) => res.send("API working"))
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebhooks)
app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)




const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`server is running fixed on ${PORT}`)
})

