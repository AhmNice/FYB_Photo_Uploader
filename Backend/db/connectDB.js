import mongoose from "mongoose"
export const connectDB = async()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log('Database connected')
  } catch (error) {
    console.log(`Error connecting to database:`, error.message)
    process.exit(1)
  }
}