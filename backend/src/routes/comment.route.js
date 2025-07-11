
const express = require ('express');

const  Comment = require('../model/comment.model');
const router = express.Router();

//create a comment
router.post('/post-comments', async (req,res) => {
    /* console.log(req.body); */
    try {
        const newComment= new Comment({ ...req.body });
        await newComment.save();
        res.status(200).send({
            message: "Comment created Sucessfully",
            comment: newComment
        })
    } catch (error) {
        console.error("error Commenting:", error)
        res.status(500).send({ message: "error Commenting" })
    }
})
//get all comments count
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