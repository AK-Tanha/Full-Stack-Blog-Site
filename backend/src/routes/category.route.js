const express = require('express');
const Category = require('../model/category.model');
const Blog = require('../model/blog.model');
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

// Get all categories with post counts
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        
        // Add post count to each category
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const postCount = await Blog.countDocuments({ category: cat.name });
            return {
                ...cat._doc,
                postCount
            };
        }));

        // Sort by postCount descending
        categoriesWithCount.sort((a, b) => b.postCount - a.postCount);

        res.status(200).send(categoriesWithCount);
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
