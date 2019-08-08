const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController')

router.get('/upload', imageController.upload_get)
router.post('/upload', imageController.upload_post)
router.post('/delete',imageController.delete)
router.get('/', imageController.list)


module.exports = router