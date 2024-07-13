import { WatersCollection } from '../db/models/waterModel.js';


// temp Servise for check db
export const getAllWater = async () => {
  return WatersCollection.find();
};

export const addWater = async (payload) => {
  return WatersCollection.create(payload);
};

export const editWater = async (waterId, payload) => {
  return WatersCollection.findByIdAndUpdate(waterId, payload, { new: true });
};

export const deleteWater = async (waterId) => {
  return WatersCollection.findByIdAndDelete(waterId);
};

export const getDayWater = async (date, payload) => {
 return "abracadabra";
};

export const getMonthWater = async (payload) => {

};

export const todayWater = async (payload) => {

};