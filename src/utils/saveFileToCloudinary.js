import fs from 'node:fs/promises';
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';
import { ENV_VARS } from '../const/const.js';

cloudinary.config({
  secure: true,
  cloud_name: env(ENV_VARS.CLOUDINARY_CLOUD_NAME),
  api_key: env(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: env(ENV_VARS.CLOUDINARY_API_SECRET),
});

export default async function saveFileToCloudinary(file) {
  const response = await cloudinary.uploader.upload(file.path);
  fs.unlink(file.path);
  return response.secure_url;
}
