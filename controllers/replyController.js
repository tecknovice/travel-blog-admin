const debug = require('debug')('travel-blog-admin:replyController')
const { body, validationResult } = require('express-validator');
const Reply = require('../models/Reply')

exports.approved_get = async function (req, res, next) {
    const replies = await Reply
        .find({ status: 'approved' })
        .sort({ repliedTime: 'asc' })
        .populate('comment', 'comment')
    res.render('reply-approved', { title: 'Approved replies', replies, status: 'approved' })
}
exports.delete_post = async function (req, res, next) {
    if (req.body.replies) {
        try {
            await Reply.deleteMany({ _id: { $in: req.body.replies } })
            res.redirect('/reply/approved')
        } catch (error) {
            return next(error)
        }
    }
}
exports.pending_get = async function (req, res, next) {
    const replies = await Reply
        .find({ status: 'pending' })
        .sort({ repliedTime: 'asc' })
        .populate('comment', 'comment')
    debug('pending_get:replies', replies)
    res.render('reply-pending', { title: 'Pending replies', replies, status: 'pending' })
}
exports.pending_post = [
    body('action').isIn(['approve', 'delete']),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            try {
                const replies = await Reply
                    .find({ status: 'pending' })
                    .sort({ repliedTime: 'asc' })
                    .populate('comment', 'comment')
                res.render('reply-pending', { title: 'Pending replies', replies, status: 'pending', warning_messages: result.errors.map(error => error.msg) })
                return
            } catch (error) {
                return next(error)
            }

        }
        if (req.body.replies) {
            try {
                switch (req.body.action) {
                    case 'approve':
                        await Reply.updateMany({ _id: { $in: req.body.replies } }, { status: 'approved' });
                        break;
                    case 'delete':
                        await Reply.deleteMany({ _id: { $in: req.body.replies } })
                        break;
                }
                res.redirect('/reply/pending')
            } catch (error) {
                return next(error)
            }
        }
    }
]