const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController')

router.get('/approved', commentController.approved_get)
router.post('/delete', commentController.delete_post)
router.get('/pending', commentController.pending_get)
router.post('/pending', commentController.pending_post)

module.exports = router