import { Schema, model } from "mongoose";

const contactSchema = new Schema({
    name: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    email: {type: String, required: false},
    isFavourite : {type: Boolean, required: false},
    contactType: {type: String, required: false},
    userId: {type: Schema.ObjectId, required: true},
    photo: {type: String, required: false},
}, {timestamps: true, versionKey: false});

export const ContactCollection = model("contacts", contactSchema); // "contacts" - назва колекції
