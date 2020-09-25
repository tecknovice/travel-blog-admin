const express = require('express');
const router = express.Router();
const replyController = require('../controllers/replyController')

router.get('/approved', replyController.approved_get)
router.post('/delete', replyController.delete_post)
router.get('/pending', replyController.pending_get)
router.post('/pending', replyController.pending_post)

module.exports = router