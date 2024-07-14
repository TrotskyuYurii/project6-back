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

  return water;
};

export const getDayWater = async (date, payload) => {
  return WatersCollection.find({ date: date });
};

export const getMonthWater = async (date, payload) => {

  const [_, month, year] = date.split('-');
  const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);

  return WatersCollection.find({ date: dateRegex });
};
