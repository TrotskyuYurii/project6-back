import { Router } from "express"
import {getDefaultController, getAllContactsController, getContactsByIdController, postNewContactController,patchContactsByIdController,deleteContactsByIdController} from '../controllers/contacts.js';
import {ctrlWrapper} from '../middlewares/ctrlWrapper.js';
import {validateBody} from '../middlewares/validateBody.js';
import { upload } from "../middlewares/upload.js";
import {contactsCreateBodySchema} from '../validation/contactsCreateBodySchema.js';
import {contactsPatchBodySchema} from '../validation/contactsPatchBodySchema.js';
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = Router();



//обробка запитів
//Звернення по дефолтному маршруту
// contactsRouter.get('/', ctrlWrapper(getDefaultController));
contactsRouter.use('/', authenticate);

//Отримання всіх контактів
contactsRouter.get('/', ctrlWrapper(getAllContactsController));

//Отримання конкретного контакта за ID
contactsRouter.get('/:contactid', ctrlWrapper(getContactsByIdController));

//Створення нового контакту
// contactsRouter.post('/',validateBody(contactsCreateBodySchema),ctrlWrapper(postNewContactController));
contactsRouter.post('/', upload.single('photo'),validateBody(contactsCreateBodySchema),ctrlWrapper(postNewContactController));

//Оновлення конкретного контакта за ID
// contactsRouter.patch('/:contactid', validateBody(contactsPatchBodySchema), ctrlWrapper(patchContactsByIdController));
contactsRouter.patch('/:contactid', upload.single('photo'),validateBody(contactsPatchBodySchema), ctrlWrapper(patchContactsByIdController));

//Видалення конкретного контакта за ID
contactsRouter.delete('/:contactid',ctrlWrapper(deleteContactsByIdController));


// //Обробка помилок при невідомих запитах
// contactsRouter.use('*', (req, res, next) => {

//     res.status(404).json({
//         message: 'Route not found',
//     });

// });

// //Обробка помилок при невідомії помилці
// contactsRouter.use((err, req, res, next) => {
//     res.status(500).json({
//         message: 'Something went wrong',
//         error: err.message,
//     });
// });


export default contactsRouter;