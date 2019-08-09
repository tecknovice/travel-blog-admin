const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController')

router.get('/create', tagController.create_get)
router.post('/create', tagController.create_post)
router.get('/update', tagController.update_get)
router.post('/update', tagController.update_post)
router.post('/delete',tagController.delete)
router.get('/', tagController.list)

module.exports = router