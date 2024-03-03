const router = require('express').Router();

const userController = require('../controllers/userController');
const {verifyTokenAndAuthorization, verifyAdmin} = require('../middlewares/verifyToken');

router.get('/', verifyTokenAndAuthorization, userController.getUser);
router.delete('/', verifyTokenAndAuthorization, userController.deleteUser);
router.put('/', verifyTokenAndAuthorization, userController.updateUser);
router.put('/updateUserByAdmin/:id', verifyAdmin, userController.updateUserByAdmin);
router.get('/getAllUsers', verifyAdmin, userController.getAllUsers);
router.get('/getUserById/:id', verifyAdmin, userController.getUserById);
router.put('/changePassword', verifyTokenAndAuthorization, userController.changePassword);
module.exports = router;