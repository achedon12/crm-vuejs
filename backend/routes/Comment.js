const express = require('express')

const Comment = require('../models/TaskComment');
const User = require('../models/User');
const verifyToken = require("../middleware/jwt");

const router = express.Router();

router.post('/', verifyToken, async(req, res) => {
    try {
        const newComment = new Comment(req.body);
        const commentCreated = await newComment.save();
        res.status(201).json(commentCreated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'An error occurred while creating the comment' });
    }
})

router.put('/:id', verifyToken, async(req, res) => {
    try {
        const commentToUpdate = await Comment.findById(req.params.id);
        if (!commentToUpdate) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (commentToUpdate.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this comment' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the comment' });
    }
})

router.get('/:id', verifyToken, async(req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('user', 'name email _id');
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.status(200).json(comment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving the comment' });
    }
})

module.exports = router;