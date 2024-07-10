import mongoose from 'mongoose';
import createHttpError from 'http-errors';
import {ContactCollection} from '../models/contact.js';
import { saveFile } from '../utils/saveFile.js';


// Додаткова функція для розрахунку параметрів пагінації
const createPaginationInformation = (page, perPage, count) => {
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
  
    return {
      page,
      perPage,
      totalItems: count,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    };
  };




  export const getAllContacts = async ({page=1, perPage=10, sortBy="_id", sortOrder="asc", userId}) => {
    //Параметри пагінації
    const count = await ContactCollection.countDocuments({ userId });
    const paginationInformation = createPaginationInformation(page, perPage, count);
    
    const dataContacts = await ContactCollection
        .find({ userId })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ [sortBy]: sortOrder })
        .exec();

    return {
        data: dataContacts,
        ...paginationInformation
    };
}



export const getContactsById = async ({id, userId}) => {
    const idobj = { _id: id, userId };
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createHttpError(404, 'invalid ID');
      }



      const contactsfound = await ContactCollection.find(idobj);

      if (!contactsfound || contactsfound.length === 0) {
        throw createHttpError(404, `Contact with id ${id} not found!`);
    }
    return contactsfound;
}


export const createNewContact = async ({photo, ...payload }, userId) => {

    const url = await saveFile(photo);

    const newContact = await ContactCollection.create({...payload, userId:userId, photo: url});
    return newContact;
}


export const patchContactsById = async (id, {photo, ...payload }, userId, options = {}) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(404, 'Invalid ID');
    }
    
    const url = await saveFile(photo);

    const updateObj = { _id: id, userId };
    const patchedContact = await ContactCollection.findOneAndUpdate(
      updateObj,
      { ...payload, photo: url },
      { new: true, ...options }
    );
  
    if (!patchedContact) {
      throw createHttpError(404, `Contact with id ${id} not found or does not belong to the user!`);
    }
  
    return patchedContact;
  };


export const deleteContactsById = async (id, userId) => {
    const idObj = { _id: id, userId };
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(404, 'Invalid ID');
    }
  
    const contactDeleted = await ContactCollection.findOneAndDelete(idObj);
  
    if (!contactDeleted) {
      throw createHttpError(404, `Contact with id ${id} not found or does not belong to the user!`);
    }
    return contactDeleted;
  };