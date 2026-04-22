const express = require ('express');
const Comment = require('../model/comment.model');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Create a comment
router.post('/post-comments', verifyToken, async (req,res) => {
    try {
        const newComment = new Comment({ 
            ...req.body,
            user: req.userId // Use the ID from verifyToken
        });
        await newComment.save();
        res.status(200).send({
            message: "Comment created successfully",
            comment: newComment
        })
    } catch (error) {
        console.error("error Commenting:", error)
        res.status(500).send({ message: "error Commenting" })
    }
})

// Update a comment (Only owner can update)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        
        const existingComment = await Comment.findById(id);
        if (!existingComment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        // Check ownership
        if (existingComment.user.toString() !== req.userId) {
            return res.status(403).send({ message: "You are not authorized to update this comment" });
        }

        existingComment.comment = comment;
        await existingComment.save();

        res.status(200).send({
            message: "Comment updated successfully",
            comment: existingComment
        });
    } catch (error) {
        console.error("error updating Comment:", error)
        res.status(500).send({ message: "error updating Comment" })
    }
});

// Delete a comment (Only owner or admin can delete)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const existingComment = await Comment.findById(id);
        
        if (!existingComment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        // Check ownership OR if user is admin
        if (existingComment.user.toString() !== req.userId && req.role !== 'admin') {
            return res.status(403).send({ message: "You are not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(id);
        res.status(200).send({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("error deleting Comment:", error)
        res.status(500).send({ message: "error deleting Comment" })
    }
});

// Get all comments count
router.get('/total-comment', async (req, res) => {
    try {
        const totalComment = await Comment.countDocuments({});
        res.status(200).send({
            message: "total comments",
            totalComment
        })
    } catch (error) {
        console.error("error counting Comments:", error)
        res.status(500).send({ message: "error counting Comments" })
    }
})

module.exports = router;