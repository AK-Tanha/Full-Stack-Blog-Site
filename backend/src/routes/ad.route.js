const express = require('express');
const Ad = require('../model/ad.model');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Create an Ad (Admin Only)
router.post('/create-ad', verifyToken, isAdmin, async (req, res) => {
    try {
        const newAd = new Ad(req.body);
        await newAd.save();
        res.status(201).send({ message: "Ad created successfully", ad: newAd });
    } catch (error) {
        console.error("Error creating ad:", error);
        res.status(500).send({ message: "Failed to create ad" });
    }
});

// Get all Ads (Public or Admin)
router.get('/', async (req, res) => {
    try {
        const { slot, isActive, category } = req.query;
        const query = {};
        if (slot) query.slot = slot;
        if (isActive !== undefined) {
            query.isActive = isActive === 'true' || isActive === true;
        }
        if (category) {
            query.$or = [
                { category: category },
                { category: { $exists: false } },
                { category: "" },
                { category: null }
            ];
        }

        const ads = await Ad.find(query).sort({ createdAt: -1 });
        res.status(200).send(ads);
    } catch (error) {
        console.error("Error fetching ads:", error);
        res.status(500).send({ message: "Failed to fetch ads" });
    }
});

// Get a single Ad by ID
router.get('/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).send({ message: "Ad not found" });
        res.status(200).send(ad);
    } catch (error) {
        console.error("Error fetching ad:", error);
        res.status(500).send({ message: "Failed to fetch ad" });
    }
});

// Update an Ad (Admin Only)
router.patch('/update-ad/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAd) return res.status(404).send({ message: "Ad not found" });
        res.status(200).send({ message: "Ad updated successfully", ad: updatedAd });
    } catch (error) {
        console.error("Error updating ad:", error);
        res.status(500).send({ message: "Failed to update ad" });
    }
});

// Delete an Ad (Admin Only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const ad = await Ad.findByIdAndDelete(req.params.id);
        if (!ad) return res.status(404).send({ message: "Ad not found" });
        res.status(200).send({ message: "Ad deleted successfully" });
    } catch (error) {
        console.error("Error deleting ad:", error);
        res.status(500).send({ message: "Failed to delete ad" });
    }
});

module.exports = router;
