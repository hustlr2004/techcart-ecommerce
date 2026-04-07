const router = require('express').Router();
const { upload, cloudinary } = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isAdmin');

router.post('/single', authMiddleware, isAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  return res.json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

router.delete('/:public_id', authMiddleware, isAdmin, async (req, res, next) => {
  try {
    await cloudinary.uploader.destroy(req.params.public_id);
    return res.json({ message: 'Image deleted' });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
