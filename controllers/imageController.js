const multer = require('multer')
const dimensions = require('image-size')
const fs = require('fs')
const { body, query, validationResult } = require('express-validator');
const debug = require('debug')('travel-blog-admin:imageController')
const path = require('path');

const Image = require('../models/Image')
const imagePerPage = 8
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..','public','images'))
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
        debug('upload_post:dirname',__dirname)
        const d = dimensions(req.file.path)
        const image = new Image({
            title: req.file.originalname,
            name: req.file.filename,
            size: req.file.size,
            dimensions: [d.width, d.height]
        })
        try {
            await image.save()
            res.render('image-form', { title: 'Upload image', success_message: 'Uploaded successfully!' })
        } catch (error) {
            return next(error)
        }
    }
]

exports.list_get = [
    query('page', 'page must be a positive integer').optional().isInt({ min: 1 }),
    async function (req, res, next) {
        let page
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('/image')
        }
        else {
            page = req.query.page || 1
        }
        try {
            // const images = await Image.find().skip((page - 1) * imagePerPage).limit(imagePerPage).sort({ name: 'desc' })
            const images = await Image.find({}, null, {
                skip: (page - 1) * imagePerPage,
                limit: imagePerPage,
                sort: { name: 'desc' }
            })
            const totalImage = await Image.estimatedDocumentCount();
            const totalPage = Math.ceil(totalImage / imagePerPage)
            res.render('image-list', { title: 'Images list', images, page, totalPage })

        } catch (error) {
            return next(error)
        }
    }
]

exports.list_post = [
    body('page', 'page must be a positive integer').optional().isInt({ min: 1 }),
    async function (req, res, next) {
        let page
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send({errors:errors.toString()})
        }
        else {
            page = req.body.page || 1
        }
        try {
            // const images = await Image.find().skip((page - 1) * imagePerPage).limit(imagePerPage).sort({ name: 'desc' })
            const images = await Image.find({}, null, {
                skip: (page - 1) * imagePerPage,
                limit: imagePerPage,
                sort: { name: 'desc' }
            })
            const totalImage = await Image.estimatedDocumentCount();
            const totalPage = Math.ceil(totalImage / imagePerPage)
            res.send( { images, page, totalPage })

        } catch (error) {
            return next(error)
        }
    }
]

exports.delete = [
    body('page', 'page must be a positive integer').optional().isInt({ min: 1 }),
    async function (req, res, next) {
        let page
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect(`/image?page=1`)
        }
        else {
            page = req.query.page || 1
        }
        if (req.body.list) {
            try {
                //delete images
                const delete_images = await Image.find({ _id: { $in: req.body.list } })
                await Image.deleteMany({ _id: { $in: req.body.list } })
                delete_images.forEach(image => {
                    const fileName = image.name
                    fs.unlinkSync(`public/images/${fileName}`)
                });
            } catch (error) {
                return next(error)
            }
        }
        res.redirect(`/image?page=${page}`)
    }
]




