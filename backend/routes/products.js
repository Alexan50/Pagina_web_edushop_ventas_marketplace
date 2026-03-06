const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), ctrl.update);
router.put('/:id', verifyToken, isAdmin, ctrl.update);
router.delete('/:id', verifyToken, isAdmin, ctrl.remove);
module.exports = router;