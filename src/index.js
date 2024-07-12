import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { TEMP_UPLOAD_DIR } from './const/const.js';
import { createFolderIfDoesNotExist } from './utils/createFolderIfDoesNotExist.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createFolderIfDoesNotExist(TEMP_UPLOAD_DIR);
  setupServer();
};

bootstrap();
