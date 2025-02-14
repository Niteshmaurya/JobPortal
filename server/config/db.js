import mongoose from "mongoose";


// function to connect to mongoDb database
const connectDb = async () => {
    mongoose.connection.on('connected', () => console.log('database connected'))

    await mongoose.connect(`${process.env.MONGODB_URI}/Job-Portal`)
}


export default connectDb  