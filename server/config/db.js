import mongoose from 'mongoose';

// Function to connect to MongoDB
const connectDB = async () => {
    // Ensure the MONGO_URI is available
    if (!process.env.MONGO_URI) {
        console.error("FATAL ERROR: MONGO_URI is not defined in config.env!");
        process.exit(1); // Exit process if critical environment variable is missing
    }
    
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Success message for MongoDB connection
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails (likely due to 'bad auth'), log the error
        console.error(`MongoDB Connection Error: ${error.message}`);
        
        // This is where your 'bad auth' error is originating
        // Note: 'bad auth' means the URI/password is wrong, not that the connection itself failed.
        process.exit(1);
    }
};

export default connectDB;
