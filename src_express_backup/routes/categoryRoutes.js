const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { verifyAdmin, verifyToken } = require('../middlewares/authMiddleware');

// Semua user bisa lihat kategori
router.get('/', verifyToken, getAllCategories);

// Hanya admin yang bisa tambah & hapus
router.post('/', verifyAdmin, createCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

module.exports = router;