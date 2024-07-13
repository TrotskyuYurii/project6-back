import { addWater, deleteWater, editWater, getAllWater, getDayWater, getMonthWater } from '../services/water.js';


// temp Controller for check db
export const getAllWaterController = async (req, res) => {
  try {
    const water = await getAllWater();
    res.json(water);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addWaterController = async (req, res) => {
  try {
    const water = await addWater(req.body);
    res.status(201).json(water);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const editWaterByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWater = await editWater(id, req.body);
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
    const { id } = req.params;
    const deletedWater = await deleteWater(id);
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
  const water = await getDayWater(date);
   res.json(water);
} catch (error) {
  res.status(500).json({ message: 'Server error' });
}
};

export const monthWaterController = async (req, res) => {
try {
  const { date } = req.params;
  const water = await getMonthWater(date);
   res.json(water);
} catch (error) {
  res.status(500).json({ message: 'Server error' });
}}

export const todayWaterController = async (req, res) => {

};