import mongoose from 'mongoose';
import { addWater, deleteWater, editWater, getDayWater, getMonthWater } from '../services/water.js';


const setAuthWaterId = (req) => {
  let authWaterId = {};
  const { waterId } = req.params;
  const userId = req.user._id;
  if (waterId) {
    authWaterId = { _id: waterId };
  }
  if (userId) {
    authWaterId = { ...authWaterId, userId: userId };
  }

  return authWaterId;
};


export const addWaterController = async (req, res) => {

  try {
    const water = await addWater({
      userId: req.user._id,
      ...req.body,
    });
    res.status(201).json(water);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editWaterByIdController = async (req, res) => {
  try {
    const authWaterId = setAuthWaterId(req);
    const updatedWater = await editWater(authWaterId, {...req.body });
    if (!updatedWater) {
      return res.status(404).json({ message: 'Water record not found' });
    }
    res.status(200).json(updatedWater);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWaterController = async (req, res) => {
  try {
    const authWaterId = setAuthWaterId(req);
    const deletedWater = await deleteWater(authWaterId);
    if (!deletedWater) {
      return res.status(404).json({ message: 'Water record not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const dayWaterController = async (req, res) => {
  try {
    const { date } = req.params;
    const authData = setAuthWaterId(req);
    const userId = authData.userId instanceof mongoose.Types.ObjectId 
      ? authData.userId 
      : new mongoose.Types.ObjectId(authData.userId);

    const water = await getDayWater(date, userId);
    if (!water || water.length === 0) {
      return res.status(404).json({ message: 'Water records not found for this user' });
    }
    res.json(water);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const monthWaterController = async (req, res) => {
  try {
    const { date } = req.params;
    const authData = setAuthWaterId(req);
    const userId = authData.userId instanceof mongoose.Types.ObjectId 
      ? authData.userId 
      : new mongoose.Types.ObjectId(authData.userId);

    const water = await getMonthWater(date, userId);
    if (!water || water.length === 0) {
      return res.status(404).json({ message: 'Water records not found for this user' });
    }
    res.json(water);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
