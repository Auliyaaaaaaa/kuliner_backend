const express = require('express');
const router = express.Router();
const { getAllFoods, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');
const { verifyAdmin, verifyToken } = require('../middlewares/authMiddleware');

// Semua user bisa lihat makanan
router.get('/', verifyToken, getAllFoods);
router.get('/:id', verifyToken, getFoodById);

// Hanya admin yang bisa tambah, edit, hapus
router.post('/', verifyAdmin, createFood);
router.put('/:id', verifyAdmin, updateFood);
router.delete('/:id', verifyAdmin, deleteFood);

module.exports = router;