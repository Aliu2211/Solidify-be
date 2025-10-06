import { v2 as cloudinary } from 'cloudinary';
import config from './environment';
import logger from '../utils/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// Verify configuration
if (config.CLOUDINARY_CLOUD_NAME && config.CLOUDINARY_API_KEY && config.CLOUDINARY_API_SECRET) {
  logger.info('✅ Cloudinary configured successfully');
} else {
  logger.warn('⚠️  Cloudinary credentials not found. File uploads will not work.');
}

export default cloudinary;
