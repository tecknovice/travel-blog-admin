const debug = require('debug')('travel-blog-admin:tagController')
const { body, param, validationResult } = require('express-validator');
const Tag = require('../models/Tag')
exports.create_get = function (req, res, next) {
    res.render('tag-create', { title: 'Create tag' })
}
exports.create_post = [
    body('name', 'name must be at least 1 character').isLength({ min: 1 }),
    body('image_id').isLength({ min: 24, max: 24 }).withMessage('image_id must be 24 characters')
        .matches(/^[A-Fa-f0-9]*$/).withMessage('image_id only contain number and A-F a-f 0-9'),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.render('tag-create', { title: 'Create tag', warning_messages: result.errors.map(error => error.msg) })
            return
        }
        const tag = new Tag({
            name: req.body.name,
            image: req.body.image_id
        })
        try {
            await tag.save()
            res.render('tag-create', { title: 'Create tag', success_message: 'Created successfully!' })
        } catch (error) {
            return next(error)
        }
    }
]

exports.update_get = [
    param('id').isLength({ min: 24, max: 24 }).withMessage('id must be 24 characters')
        .matches(/^[A-Fa-f0-9]*$/).withMessage('id only contain number and A-F a-f 0-9'),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.redirect('/tag')
            return
        }
        try {
            const tag = await Tag.findById(req.params.id).populate('image').exec()

            if (tag)
                res.render('tag-update', { title: 'Update tag', name: tag.name, image: tag.image })
            else
                res.redirect('/tag')
        } catch (error) {
            return next(error)
        }
    }
]
exports.update_post = [
    param('id').isLength({ min: 24, max: 24 }).withMessage('tag_id must be 24 characters')
        .matches(/^[A-Fa-f0-9]*$/).withMessage('tag_id only contain number and A-F a-f 0-9'),
    body('name', 'name must be at least 1 character').isString().isLength({ min: 1 }),
    body('image_id').isLength({ min: 24, max: 24 }).withMessage('image_id must be 24 characters')
        .matches(/^[A-Fa-f0-9]*$/).withMessage('image_id only contain number and A-F a-f 0-9'),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.render('tag-update', { title: 'Update tag', warning_messages: result.errors.map(error => error.msg) })
            return
        }
        const tag = new Tag({
            name: req.body.name,
            image: req.body.image_id,
            _id: req.params.id
        })
        try {
            await Tag.findByIdAndUpdate(req.params.id, tag)
            res.redirect('/tag')
        } catch (error) {
            return next(error)
        }
    }
]
exports.delete = async function (req, res, next) {
    if (req.body.tags) {
        try {
            //delete tags
            await Tag.deleteMany({ _id: { $in: req.body.tags } })
            await list(req,res,next)
        } catch (error) {
            return next(error)
        }
    }
}
exports.list = async function (req, res, next) {
    const tags = await Tag.find().populate({
        path: 'image',
    }).exec()
    res.render('tag-list', { title: 'Tags list', tags })
}