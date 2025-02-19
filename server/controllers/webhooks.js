import { Webhook } from "svix";
import User from "../models/User.js";
import dotenv from 'dotenv';
dotenv.config();

// api controller function to manage clerk user with db
export const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with Clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        console.log("Webhook secret key in clerkWebhooks: " + process.env.CLERK_WEBHOOK_SECRET);

        // Verifying headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Getting data from req body
        const { data, type } = req.body;

        // Handling different webhook events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: String(data.id), // Ensuring _id is a string
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`, // String interpolation
                    image: data.image_url,
                    resume: '' // Default value for resume
                };

                await User.create(userData);
                console.log("User created: ", userData);
                res.status(200).json({ success: true, message: 'User created successfully' });
                break;
            }
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: `${data.first_name} ${data.last_name}`,
                    image: data.image_url,
                };

                await User.findByIdAndUpdate(String(data.id), userData);
                console.log("User updated: ", userData);
                res.status(200).json({ success: true, message: 'User updated successfully' });
                break;
            }
            case 'user.deleted': {
                await User.findByIdAndDelete(String(data.id));
                console.log("User deleted: ", data.id);
                res.status(200).json({ success: true, message: 'User deleted successfully' });
                break;
            }
            default:
                res.status(400).json({ success: false, message: 'Unhandled event type' });
                break;
        }
    } catch (err) {
        // More detailed error handling
        console.error("Webhook Error: ", err.message || err);
        console.log("Request body: ", req.body);

        res.status(400).json({
            success: false,
            message: 'Webhook validation or processing failed'
        });
    }
};
