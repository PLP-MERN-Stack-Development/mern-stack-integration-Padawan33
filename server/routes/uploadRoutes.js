import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Define storage for Multer: saves files to the 'uploads' folder
const storage = multer.diskStorage({
  // Destination function
  destination: (req, file, cb) => {
    // Saves files to the 'uploads' directory
    cb(null, 'uploads/'); 
  },
  // Filename function: names the file to prevent duplicates
  filename: (req, file, cb) => {
    // Generates a unique name based on timestamp and original extension
    const ext = path.extname(file.originalname);
    cb(null, 'post-' + Date.now() + ext);
  }
});

// Initialize Multer upload middleware
// limits the file size to 5MB
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// POST endpoint for file upload
// The field name 'file' must match the FormData key used by the client
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  // Respond with the file path/filename.
  // The path starts with /uploads because of the static middleware we set up below.
  res.json({ filename: req.file.filename, path: `/uploads/${req.file.filename}` });
});

export default router;