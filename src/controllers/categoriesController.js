// controllers/categoriesController.js
const asyncHandler = require('express-async-handler');
const AppDataSource = require('../data-source');

const categoryRepo = AppDataSource.getRepository('Category');

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryRepo.find();
  res.json(categories);
});

exports.getCategory = asyncHandler(async (req, res) => {
  const category = await categoryRepo.findOneBy({ id: req.params.id });
  res.json(category);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const cat = categoryRepo.create(req.body);
  const saved = await categoryRepo.save(cat);
  res.status(201).json(saved);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  await categoryRepo.update(req.params.id, req.body);
  const updated = await categoryRepo.findOneBy({ id: req.params.id });
  res.json(updated);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  await categoryRepo.delete(req.params.id);
  res.status(204).send('Category deleted');
});
