const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../utils/fileUpload');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/images/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Por favor, envie um arquivo' });
    }
    
    res.status(200).json({
      success: true,
      filePath: `/images/products/${req.file.filename}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro ao fazer upload do arquivo' });
  }
});

module.exports = router;
