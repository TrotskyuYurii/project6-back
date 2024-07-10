import mongoose from 'mongoose';
import { env } from '../utils/env.js';
import { ENV_VARS } from '../const/const.js';

export const initMongoConnection = async () => {

  const connectionLink = `mongodb+srv://${env(ENV_VARS.MONGODB_USER)}:${env(
    ENV_VARS.MONGODB_PASSWORD,
  )}@${env(ENV_VARS.MONGODB_URL)}/${env(
    ENV_VARS.MONGODB_DB,
  )}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(connectionLink);
    console.log('Successfully established db connection!');
  } catch (err) {
    console.log(err);
    throw err;
  }
  
};
