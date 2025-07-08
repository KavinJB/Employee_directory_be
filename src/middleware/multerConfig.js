import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/User_Profile/')); // Ensure folder exists
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter: only images
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
