const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController')

router.get('/create', postController.create_get)
router.post('/create', postController.create_post)
router.get('/update/:id', postController.update_get)
router.post('/update/:id', postController.update_post)
router.post('/delete', postController.delete_post)
router.get('/published', postController.published)
router.get('/draft', postController.draft)
// router.get('/', postController.index)


module.exports = router