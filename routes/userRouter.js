const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/login', userController.login_get)
router.post('/login', userController.login_post)
// router.post('/logout', userController.logout_post)
// router.post('/logout/all', userController.logoutall_post)
router.get('/register', userController.create_get)
router.post('/register', userController.create_post)
// router.get('/update/:id', userController.update_get)
// router.post('/update/:id', postController.update_post)
// router.post('/delete', userController.delete_post)
// router.get('/profile', userController.index)


module.exports = router