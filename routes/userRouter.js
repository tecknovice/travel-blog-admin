const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')

router.get('/login', userController.login_get)
router.post('/login', userController.login_post)
router.get('/logout', userController.logout_get)
router.get('/register', userController.create_get)
router.post('/register', userController.create_post)
router.get('/update', userController.update_get)
router.post('/update-profile', userController.update_profile_post)
router.post('/change-password', userController.change_password_post)
// router.post('/delete', userController.delete_post)


module.exports = router