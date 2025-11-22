import { User } from '../model/user.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
export const fileUpload = async (req, res) => {
  const { name, nickName } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'File is required'
    });
  }

  // Rename-safe values
  const safeName = name.replace(/\s+/g, '_');
  const safeNickname = (nickName || 'user').replace(/\s+/g, '_');

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'FYB/new-uploads',
      public_id: `${Date.now()}-${safeName}_${safeNickname}`,
    });

    // ✅ Delete local file
    fs.unlinkSync(req.file.path);

    // ✅ Save Cloudinary URL in DB
    const newUser = new User({
      name,
      nickname: nickName || '',
      filePath: result.secure_url // ✅ This is the Cloudinary image URL
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'file uploaded successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Clean up in case of error
    }
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
