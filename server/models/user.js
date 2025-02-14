import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique },
    resume: { type: String },
    image: { type: String, required: true },
})

const user = mongoose.model('User', userSchema)

export default User;