import crypto from 'crypto';
import { ONE_DAY, THIRTY_DAYS } from '../const/const.js';

export default function generateTokens() {
  return {
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: Date.now() + ONE_DAY,
    refreshTokenValidUntil: Date.now() + THIRTY_DAYS,
  };
}
