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
  return WatersCollection.find({date: date});
};

export const getMonthWater = async (date, payload) => {
  
  const [_, month, year] = date.split('-');
  const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);
  
  return WatersCollection.find({ date: dateRegex });
};

export const todayWater = async (payload) => {

};