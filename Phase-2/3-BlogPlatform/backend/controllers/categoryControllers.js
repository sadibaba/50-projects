import Category from '../models/categoryModel.js';

// Create Category
export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name, description: req.body.description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};