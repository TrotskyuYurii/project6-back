import { WatersCollection } from '../db/models/waterModel.js';


export const addWater = async (payload) => {
  return WatersCollection.create(payload);
};

export const editWater = async (waterId, payload, options = {}) => {
  const rawResult = await WatersCollection.findOneAndUpdate(
    waterId,
    payload,
    {
      new: true,
      ...options,
    },
  );

  if (!rawResult) return null;

  return rawResult;
};

export const deleteWater = async (waterId) => {
    // console.log(waterId);

  const water = await WatersCollection.findOneAndDelete(waterId);
    // console.log(water);

  if (!water) return null;

  return water;
};

  export const getDayWater = async (date, userId) => {
    return await WatersCollection.find({ date, userId });
  };

  export const getMonthWater = async (date, userId) => {

  const [_, month, year] = date.split('-');
  const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);

    return WatersCollection.find({date: dateRegex, userId: userId});
  };



  export const getMonthAgrigateWater = async (date, userId) => {

    const [_, month, year] = date.split('-');
    const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);
  
      const result = WatersCollection.find({date: dateRegex, userId: userId});

      return result;
    };
  