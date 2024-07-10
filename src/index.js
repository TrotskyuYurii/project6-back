import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './const/const.js';
import {initMongoConnection} from '../src/db/initMongoConnection.js';
import {createFolderIfDoesNotExist} from '../src/utils/createFolderIfDoesNotExist.js';
import {setupServer} from './server.js';



await initMongoConnection();
createFolderIfDoesNotExist(TEMP_UPLOAD_DIR);
createFolderIfDoesNotExist(UPLOAD_DIR);
setupServer();
