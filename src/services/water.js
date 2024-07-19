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
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    water: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteWater = async (waterId) => {
  const water = await WatersCollection.findOneAndDelete(waterId);

  return {
    _id: water._id
  };
};

  export const getDayWater = async (date, userId) => {
    return await WatersCollection.find({ date, userId });
  };

  export const getMonthWater = async (date, userId) => {

  const [_, month, year] = date.split('-');
  const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);

    return WatersCollection.find({date: dateRegex, userId: userId});
  };
