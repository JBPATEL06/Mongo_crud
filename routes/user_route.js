const express = require('express');
const router = express.Router();
const {showUsers,createUser, deleteUser, findOneUser,updateUser,searchUsers} = require('../controllers/user_controller');
const storage = require('../middleware/upload');

router.get('/search', searchUsers);
router.get('/users', showUsers);
router.get('/findOneUser/:email', findOneUser)
router.post('/createUser', storage.single('photo'), createUser);
router.put('/updateUser/:email', storage.single('photo'), updateUser);
router.delete('/deleteUser/:email', deleteUser);

module.exports = router;

