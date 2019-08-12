const debug = require('debug')('travel-blog-admin:postController')
const { body, param, validationResult } = require('express-validator');
const Post = require('../models/Post')
const Tag = require('../models/Tag')
const Image = require('../models/Image')
const async = require('async')
exports.create_get = async function (req, res, next) {
    try {
        const tags = await Tag.find()
        if (tags)
            res.render('post-form', { title: 'Create post', tags })
        else
            res.render('post-form', { title: 'Create post' })
    } catch (error) {
        return next(error)
    }
};
exports.create_post = [
    body('status').isIn(['published', 'draft']),
    body('title', 'Title is required').isString(),
    body('tags').optional().custom(async tags => {
        debug('create_post:tags', tags)
        if (Array.isArray(tags)) {
            tags.forEach(async id => {
                const tag = await Tag.findById(id)
                if (!tag) return Promise.reject()
            })
        } else if (typeof tags === 'string' || tags instanceof String) {
            const tag = await Tag.findById(tags)
            if (!tag) return Promise.reject()
        }

    }).withMessage('Some tag is not exists'),
    body('image').optional().custom(async image => {
        debug('create_post:image', image)
        const imageDocument = await Image.findById(image)
        if (!imageDocument) return Promise.reject()
    }).withMessage('Image is not exists'),
    body('content', 'Content is required').isString(),
    async function (req, res, next) {
        debug('create_post:req.body', req.body)
        const result = await validationResult(req)
        if (!result.isEmpty()) {
            debug('create_post:errors', result)
            try {
                const tags = await Tag.find()
                if (tags)
                    res.render('post-form', { title: 'Create post', warning_messages: result.errors.map(error => error.msg), tags })
                else
                    res.render('post-form', { title: 'Create post', warning_messages: result.errors.map(error => error.msg) })
                return
            } catch (error) {
                return next(error)
            }
        }
        const post = new Post({
            title: req.body.title,
            tags: req.body.tags,
            image: req.body.image,
            content: req.body.content,
            status: req.body.status
        })
        try {
            await post.save()
            switch (req.body.status) {
                case 'published':
                    res.redirect('/post/published')
                    break
                case 'draft':
                    res.redirect('/post/draft')
                    break
            }
            return
        } catch (error) {
            return next(error)
        }
    }
]
exports.update_get = function (req, res) {
    // res.send('NOT IMPLEMENTED: post update GET');
    res.render('post-form')
};
exports.update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: post update POST');
};
exports.delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: post delete POST');
};
exports.published = function (req, res) {
    res.render('post-published')
};
exports.draft = function (req, res) {
    res.render('post-draft')
};
