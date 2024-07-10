import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    createdAt : {type: Date, required: false},
    updatedAt: {type: Date, required: false},
}, {timestamps: true, versionKey: false});

export const UserCollection = model("user", userSchema); // "user" - назва колекції в базі даних
