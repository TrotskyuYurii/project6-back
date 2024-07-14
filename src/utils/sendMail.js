import nodemailer from 'nodemailer';
import { env } from './env.js';
import { ENV_VARS } from '../const/const.js';

const transporter = nodemailer.createTransport({
  host: env(ENV_VARS.SMTP_HOST),
  port: Number(env(ENV_VARS.SMTP_PORT)),
  auth: {
    user: env(ENV_VARS.SMTP_USER),
    pass: env(ENV_VARS.SMTP_PASSWORD),
  },
});
export default async function sendMail(options) {
  return await transporter.sendMail(options);
}
