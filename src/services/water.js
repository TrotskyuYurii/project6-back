import { WatersCollection } from '../db/models/waterModel.js';


  export const addWater = async (payload) => {
    return WatersCollection.create(payload);
  };

  export const editWater = async (waterId, payload) => {
    return WatersCollection.findByIdAndUpdate(waterId, payload, { new: true });
  };

  export const deleteWater = async (waterId) => {
    return WatersCollection.findByIdAndDelete(waterId);
  };

  export const getDayWater = async (date, userId) => {
    return await WatersCollection.find({ date, userId });
  };

  export const getMonthWater = async (date, userId) => {

    const [_, month, year] = date.split('-');
    const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);

    return WatersCollection.find({date: dateRegex, userId: userId});
  };
