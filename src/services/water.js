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

  export const getDayWater = async (date, waterId) => {
    return await WatersCollection.find({ date, waterId });
  };

  export const getMonthWater = async (date, waterId) => {

    const [_, month, year] = date.split('-');
    const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);

    return WatersCollection.find({date: dateRegex, waterId: waterId});
  };
