const express= require('express');
const {signup, login, getAllUsers, deleteuser, updateUser} = require('../controllers/user.controller');
const router= express.Router();

router.post('/signup', signup);
router.post('/login', login)
router.get('/', getAllUsers)
router.delete('/delete/:id', deleteuser);
router.put('/update/:id', updateUser);

module.exports= router;