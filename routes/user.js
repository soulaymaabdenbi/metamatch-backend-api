const router = require('express').Router();

const userController = require('../controllers/userController');
const {verifyTokenAndAuthorization} = require('../middlewares/verifyToken');

router.get('/', verifyTokenAndAuthorization, userController.getUser);
router.delete('/', verifyTokenAndAuthorization, userController.deleteUser);
router.put('/', verifyTokenAndAuthorization, userController.updateUser);

module.exports = router;