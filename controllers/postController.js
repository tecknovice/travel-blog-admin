const debug = require('debug')('travel-blog-admin:postController')
const { body, param, validationResult } = require('express-validator');
const Post = require('../models/Post')
const Comment = require('../models/Comment')
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
    body('title', 'Title is required').isLength({ min: 1 }),
    body('tags').optional().custom(async tags => {
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
        const imageDocument = await Image.findById(image)
        if (!imageDocument) return Promise.reject()
    }).withMessage('Image is not exists'),
    body('content').isString(),
    async function (req, res, next) {
        const result = await validationResult(req)
        if (!result.isEmpty()) {
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
exports.update_get = [
    param('id', 'Id must be ObjectId').isMongoId(),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            debug('update_get:result', result)
            res.redirect('/')
            return
        }
        try {
            const post = await Post.findById(req.params.id).populate('tags').populate('image').exec()
            if (post) {
                const tags = await Tag.find()
                if (tags) {
                    tags.forEach(tag => {
                        post.tags.forEach(post_tag => {
                            if (tag._id.toString() == post_tag._id.toString()) {
                                tag.selected = 'true'
                            }
                        })
                    })
                }
                res.render('post-form', { title: 'Update post', post, tags, image: post.image })
            }
            else
                res.redirect('/')
        } catch (error) {
            return next(error)
        }
    }
]
exports.update_post = [
    param('id', 'Id must be ObjectId').isMongoId(),
    body('status').isIn(['published', 'draft']),
    body('title', 'Title is required').isLength({ min: 1 }),
    body('tags').optional().custom(async tags => {
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
        const imageDocument = await Image.findById(image)
        if (!imageDocument) return Promise.reject()
    }).withMessage('Image is not exists'),
    body('content').isString(),
    async function (req, res, next) {
        const result = await validationResult(req)
        if (!result.isEmpty()) {
            try {
                const post = await Post.findById(req.params.id).populate('tags').populate('image').exec()
                const tags = await Tag.find()
                if (tags) {
                    tags.forEach(tag => {
                        post.tags.forEach(post_tag => {
                            if (tag._id.toString() == post_tag._id.toString()) {
                                tag.selected = 'true'
                            }
                        })
                    })
                    res.render('post-form', { title: 'Update post', warning_messages: result.errors.map(error => error.msg), post, tags, image: post.image })
                }
                else
                    res.render('post-form', { title: 'Update post', warning_messages: result.errors.map(error => error.msg), post, image: post.image })
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
            status: req.body.status,
            _id: req.params.id
        })
        try {
            await Post.findByIdAndUpdate(req.params.id, post)
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

exports.published_get = async function (req, res, next) {
    try {
        const posts = await Post.find({ status: 'published' }).populate(['tags','totalComment']).exec()
        res.render('post-published', { title: 'Published posts', posts, status: 'published' })
        return
    } catch (error) {
        return next(error)
    }
};
exports.published_post = [
    body('action').isIn(['draft', 'delete']),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            try {
                const posts = await Post.find({ status: 'published' }).populate('tags').exec()
                res.render('post-published', { title: 'Published post', posts, status: 'published', warning_messages: result.errors.map(error => error.msg) })
                return
            } catch (error) {
                return next(error)
            }

        }
        if (req.body.posts) {
            try {
                switch (req.body.action) {
                    case 'draft':
                        const result = await Post.updateMany({ _id: { $in: req.body.posts } }, { status: 'draft' });
                        break;
                    case 'delete':
                        await Post.deleteMany({ _id: { $in: req.body.posts } })
                        break;
                }
                res.redirect('/post/published')
            } catch (error) {
                return next(error)
            }
        }
    }
]
exports.draft_get = async function (req, res, next) {
    try {
        const posts = await Post.find({ status: 'draft' }).populate(['tags','totalComment']).exec()
        res.render('post-draft', { title: 'Draft posts', posts, status: 'draft' })
        return
    } catch (error) {
        return next(error)
    }
};
exports.draft_post =  [
    body('action').isIn(['publish', 'delete']),
    async function (req, res, next) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            try {
                const posts = await Post.find({ status: 'draft' }).populate('tags').exec()
                res.render('post-draft', { title: 'Draft post', posts, status: 'draft', warning_messages: result.errors.map(error => error.msg) })
                return
            } catch (error) {
                return next(error)
            }

        }
        if (req.body.posts) {
            try {
                switch (req.body.action) {
                    case 'publish':
                        const result = await Post.updateMany({ _id: { $in: req.body.posts } }, { status: 'published' });
                        break;
                    case 'delete':
                        await Post.deleteMany({ _id: { $in: req.body.posts } })
                        break;
                }
                res.redirect('/post/draft')
            } catch (error) {
                return next(error)
            }
        }
    }
]
