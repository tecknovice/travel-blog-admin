const Image = require('../models/Image')
const multer = require('multer')
const imageSize = require('image-size')
var createError = require('http-errors');
const { query, validationResult } = require('express-validator');

const debug = require('debug')('travel-blog-admin:imageController')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return callback(new Error('Please upload image'))
        callback(undefined, true)
    }
})

exports.upload_get = function (req, res) {
    res.render('image-form', { title: 'Upload image' })
};

exports.upload_post = [
    upload.single('image'),
    async (req, res, next) => {
        // debug('upload_post:req.file',req.file)
        const dimensions = imageSize(req.file.path)
        const image = new Image({
            name: req.file.filename,
            size: req.file.size,
            dimensions: [dimensions.width, dimensions.height]
        })
        try {
            await image.save()
            res.redirect('/image')
        } catch (error) {
            return next(error)
        }
    }
]
exports.list = [
    query('page', 'page must be a positive integer').optional().isInt({ min: 1 }),
    async function (req, res, next) {
        const limit = 12
        let page
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            debug('list:errors', errors.array()[0])
            res.redirect('/image')
        }
        else {
            page = req.query.page || 1
        }
        try {
            const images = await Image.find().skip((page - 1) * limit).limit(limit).sort({ name: 'desc' })
            res.render('image-list', { title: 'Images list', images })
        } catch (error) {
            return next(error)
        }
        debug('list:req.query.page', req.query.page)
        res.render('image-list', { title: 'Images list' })
    }
]
