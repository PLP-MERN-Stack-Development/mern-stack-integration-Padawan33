// server/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Check if a specific status code was set (e.g., in a controller)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    
    res.status(statusCode);

    // Send a structured JSON response
    res.json({
        success: false,
        message: err.message,
        // In development, show the stack trace; hide it in production
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};

// Middleware to handle routes that don't exist (404 Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the general error handler
};

module.exports = { errorHandler, notFound };