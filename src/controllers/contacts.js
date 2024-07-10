import {getAllContacts,getContactsById,createNewContact,patchContactsById,deleteContactsById} from '../services/contacts.js';
import {parsePaginationParams} from '../utils/parsePaginationParams.js';
import {parseSortParams} from '../utils/parseSortParams.js';






export const getDefaultController = async (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Welcome to Contacts API!',
        data: [],
    });
}




export const getAllContactsController = async (req, res) => {

    const {page, perPage} = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);    

    const contactsfound = await getAllContacts({page,perPage,sortBy,sortOrder,userId: req.user._id,});
    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contactsfound,
    });
};




export const getContactsByIdController =   async (req, res) => {

    const id = req.params.contactid;

        const contactsfound = await getContactsById({id,userId: req.user._id});

        res.status(200).json({
            status: 200,
            message: `Successfully found contact with id ${id}!`,
            data: contactsfound,
        });

};



export const postNewContactController = async (req, res) => {

    const { body, file } = req;
    const newContact = await createNewContact({...body, photo: file}, req.user._id);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
    });
}


export const patchContactsByIdController = async (req, res) => {

    const id = req.params.contactid;
    // const {body} = req;
    const { body, file } = req;

    const pathContacts = await patchContactsById(id, {...body, photo: file}, req.user._id);

    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact!',
        data: pathContacts,
    });
}

export const deleteContactsByIdController = async (req, res) => {
    const id = req.params.contactid;
    await deleteContactsById(id,req.user._id);
    res.status(204);
    res.end();
}