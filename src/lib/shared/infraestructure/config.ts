import dotenv from "dotenv";

dotenv.config();

export const {
  PORT = 3000,
  // MONGODB_URI,
  SALTROUNDS = 10,
  EXPIRES_JWT = "1h",
  SECRET_JWT_KEY="valorClaveDefecto",
  // FRONTEND_URL = "http://localhost:5173",
  // CLOUDINARY_TU_CLOUD_NAME,
  // CLOUDINARY_TU_API_KEY,
  // CLOUDINARY_TU_API_SECRET,
  // STRIPE_SECRET_KEY,
  // ADMIN_ID,
} = process.env;