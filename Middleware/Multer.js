// import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.Cloud_API_Key,
  api_secret: process.env.Cloud_API_Secret, // Click 'View API Keys' above to copy your API secret
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: async (req, file) => {
      const Format = ["image/jpg", "image/jpeg", "image/png"];
      if (Format.includes(file.mimetype)) {
        return "Images";
      } else {
        return "Resumes";
      }
    },
    format: async (req, file) => {
      const allowedFormats = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedFormats.includes(file.mimetype)) {
        throw new Error("File format is not allowed");
      }
      return file.mimetype.split("/")[1];
    }, // supports promises as well
    public_id: (req, file) =>
      `${Date.now()}_${file.originalname.split(".")[0]}`,
  },
});
// export const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./Public");
//     console.log(file);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}_` + file.originalname);
//   },
// });
