const express = require('express');
const router = express.Router();
const { createReview, getReviewsByFood, deleteReview } = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

// User harus login untuk memberikan ulasan
router.post('/', verifyToken, createReview);

// User harus login untuk melihat daftar ulasan makanan
router.get('/food/:foodId', verifyToken, getReviewsByFood);

// User/Admin harus login untuk menghapus ulasan
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;
