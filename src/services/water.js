import { WatersCollection } from '../db/models/waterModel.js';
import { UsersCollection } from '../db/models/userModel.js';



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
    try {
      const [_, month, year] = date.split('-');
      const dateRegex = new RegExp(`^\\d{2}-${month}-${year}$`);
  
      // норма води для користувача
      const user = await UsersCollection.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const waterNorma = user.waterNorma * 1000; 
  
      const waterRecords = await WatersCollection.find({
        date: dateRegex,
        userId: userId
      }).lean();
  
      // Групуємо записи по датах
      const groupedByDate = waterRecords.reduce((acc, record) => {
        if (!acc[record.date]) {
          acc[record.date] = [];
        }
        acc[record.date].push({
          _id: record._id,
          time: record.time,
          amount: record.amount
        });
        return acc;
      }, {});
  
      // Формуємо результат
      const data = Object.entries(groupedByDate).map(([date, waters]) => {
        const totalAmount = waters.reduce((sum, water) => sum + water.amount, 0);
        const percentOfNorma = Number(((totalAmount / waterNorma) * 100).toFixed(2));
        
        return {
          date,
          percentOfNorma,
          waters
        };
      });
  
      return {
        userId: userId.toString(),
        data: data
      };
    } catch (error) {
      console.error('Error in getMonthAgrigateWater:', error);
      throw error;
    }
  };
  