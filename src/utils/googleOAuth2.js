import fs from 'node:fs/promises';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import { ENV_VARS } from '../const/const.js';
import createHttpError from 'http-errors';

const PATH_JSON = path.join(process.cwd(), 'googleOAuth.json');

const oauthConfig = JSON.parse(await fs.readFile(PATH_JSON));

const googleOAuthClient = new OAuth2Client({
  clientId: env(ENV_VARS.GOOGLE_AUTH_CLIENT_ID),
  clientSecret: env(ENV_VARS.GOOGLE_AUTH_CLIENT_SECRET),
  redirectUri: oauthConfig.web.redirect_uris[0],
});

export function generateAuthUrl() {
  return googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  return await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  let fullName = 'Guest';
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }
  return fullName;
};
