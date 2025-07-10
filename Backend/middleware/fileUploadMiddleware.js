// middleware/fileUploadMiddleware.js
import multer from 'multer';

// Store uploaded file temporarily in "uploads/" folder
const upload = multer({ dest: 'uploads/' });

export default upload.single('image'); // 'file' must match the field name in your frontend FormData
