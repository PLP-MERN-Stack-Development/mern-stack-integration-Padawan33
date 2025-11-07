import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // We need File System to write the file manually
import { fileURLToPath } from 'url';

// --- ESM Setup for Directory ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// --- END ESM Setup ---

const router = express.Router();

// 💡 FIX: Switch from diskStorage to memoryStorage
// This bypasses all pathing and permission issues by loading the file into RAM.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

router.post('/', upload.single('file'), (req, res) => {
  // Now, req.file will be an object in memory, not a file on disk
  if (!req.file) {
    console.error("[Multer Error] req.file is undefined. File was not received in memory.");
    return res.status(400).json({ success: false, message: 'No file uploaded or file was rejected.' });
  }

  // 💡 NEW LOGIC: Manually write the file from memory to disk
  try {
    // 1. Get the file buffer from memory
    const buffer = req.file.buffer;
    
    // 2. Create a unique filename
    const ext = path.extname(req.file.originalname);
    const filename = `post-${Date.now()}${ext}`;
    
    // 3. Define the absolute path to save the file
    const uploadPath = path.join(__dirname, '../uploads', filename);

    // 4. Write the file to the 'uploads' directory
    fs.writeFileSync(uploadPath, buffer);

    // 5. If successful, send back the path.
    const filePath = `/uploads/${filename}`;
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      imagePath: filePath,
    });

  } catch (err) {
    console.error("[File Write Error] Could not save file from memory to disk:", err);
    res.status(500).json({ success: false, message: 'Server error while saving file.' });
  }
});

export default router;