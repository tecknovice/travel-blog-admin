const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/login', userController.login_get)
router.post('/login', userController.login_post)
router.get('/logout', userController.logout_get)
router.get('/register', userController.create_get)
router.post('/register', userController.create_post)
// router.get('/update/:id', userController.update_get)
// router.post('/update/:id', postController.update_post)
// router.post('/delete', userController.delete_post)
// router.get('/profile', userController.index)


module.exports = router