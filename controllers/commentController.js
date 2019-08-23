const debug = require('debug')('travel-blog-admin:commentController')
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment')

exports.approved_get = async function (req, res, next) {
    const comments = await Comment
        .find({ status: 'approved' })
        .sort({ commentedTime: 'asc' })
        .populate('post', 'title')
    res.render('comment-approved', { title: 'Approved comments', comments, status: 'approved' })
}
exports.delete_post = async function (req, res, next) {
    if (req.body.comments) {
        try {
            await Comment.deleteMany({ _id: { $in: req.body.comments } })
            res.redirect('/comment/approved')
        } catch (error) {
            return next(error)
        }
    }
}
exports.pending_get = async function (req, res, next) {
    const comments = await Comment
        .find({ status: 'pending' })
        .sort({ commentedTime: 'asc' })
        .populate('post', 'title')
    debug('pending_get:comments', comments)
    res.render('comment-pending', { title: 'Pending comments', comments, status: 'pending' })
}
exports.pending_post = [
    body('action').isIn(['approve', 'delete']),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            try {
                const comments = await Comment
                    .find({ status: 'pending' })
                    .sort({ commentedTime: 'asc' })
                    .populate('post', 'title')
                res.render('comment-pending', { title: 'Pending comments', comments, status: 'pending', warning_messages: result.errors.map(error => error.msg) })
                return
            } catch (error) {
                return next(error)
            }

        }
        if (req.body.comments) {
            try {
                switch (req.body.action) {
                    case 'approve':
                        const result = await Comment.updateMany({ _id: { $in: req.body.comments } }, { status: 'approved' });
                        break;
                    case 'delete':
                        await Comment.deleteMany({ _id: { $in: req.body.comments } })
                        break;
                }
                res.redirect('/comment/pending')
            } catch (error) {
                return next(error)
            }
        }
    }
]