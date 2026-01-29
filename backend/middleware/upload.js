const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Projects - PERFECT CROPPING
const projectStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flipr-assignment/Projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 800,
        height: 600,
        crop: "fill", // ✅ Changed to 'fill' - fills entire space
        gravity: "center", // ✅ Centers the crop
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  },
});

// Storage for Clients - Circular profile photos
const clientStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flipr-assignment/Clients",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        quality: "auto",
      },
    ],
  },
});

const uploadProject = multer({
  storage: projectStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const uploadClient = multer({
  storage: clientStorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = { uploadProject, uploadClient, cloudinary };
