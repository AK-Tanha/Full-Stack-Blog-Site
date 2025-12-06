const express = require('express');
const Category = require('../model/category.model');
const router = express.Router();

// Create a new category
router.post('/create-category', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(200).send({ message: "Category created successfully", category });
    } catch (error) {
        console.error("Error creating category", error);
        res.status(500).send({ message: "Failed to create category" });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).send(categories);
    } catch (error) {
        console.error("Error fetching categories", error);
        res.status(500).send({ message: "Failed to fetch categories" });
    }
});

// Delete a category
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Category.findByIdAndDelete(id);
        res.status(200).send({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category", error);
        res.status(500).send({ message: "Failed to delete category" });
    }
});

module.exports = router;
