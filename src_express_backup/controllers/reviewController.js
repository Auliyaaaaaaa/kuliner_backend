const db = require('../config/db');

// Tambah ulasan baru (User Only)
const createReview = async (req, res) => {
    try {
        const { food_id, rating, comment } = req.body;
        const user_id = req.user.id;

        // Validasi input
        if (!food_id || !rating) {
            return res.status(400).json({ message: 'Food ID dan rating wajib diisi!' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating harus bernilai antara 1 sampai 5!' });
        }

        // Cek apakah makanan ada
        const [food] = await db.query('SELECT * FROM foods WHERE id = ?', [food_id]);
        if (food.length === 0) {
            return res.status(404).json({ message: 'Makanan tidak ditemukan!' });
        }

        // Simpan ulasan ke database
        await db.query(
            'INSERT INTO reviews (user_id, food_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, food_id, rating, comment || null]
        );

        // Hitung ulang avg_rating untuk makanan tersebut
        const [avgResult] = await db.query(
            'SELECT AVG(rating) as avgRating FROM reviews WHERE food_id = ?',
            [food_id]
        );
        const newAvgRating = avgResult[0].avgRating || 0.00;

        // Update avg_rating di tabel foods
        await db.query(
            'UPDATE foods SET avg_rating = ? WHERE id = ?',
            [newAvgRating, food_id]
        );

        res.status(201).json({ message: 'Ulasan berhasil ditambahkan!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Ambil semua ulasan untuk makanan tertentu (Public)
const getReviewsByFood = async (req, res) => {
    try {
        const { foodId } = req.params;

        // Query ulasan beserta nama user yang memberikan ulasan
        const [reviews] = await db.query(
            `SELECT reviews.*, users.name as user_name 
             FROM reviews 
             LEFT JOIN users ON reviews.user_id = users.id 
             WHERE reviews.food_id = ? 
             ORDER BY reviews.created_at DESC`,
            [foodId]
        );

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Hapus ulasan (User Pemilik / Admin)
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const user_role = req.user.role;

        // Cek apakah ulasan ada
        const [existing] = await db.query('SELECT * FROM reviews WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Ulasan tidak ditemukan!' });
        }

        const review = existing[0];

        // Pastikan yang menghapus adalah pemilik ulasan ATAU admin
        if (review.user_id !== user_id && user_role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak! Kamu tidak bisa menghapus ulasan orang lain.' });
        }

        // Hapus ulasan
        await db.query('DELETE FROM reviews WHERE id = ?', [id]);

        // Hitung ulang avg_rating untuk makanan tersebut
        const [avgResult] = await db.query(
            'SELECT AVG(rating) as avgRating FROM reviews WHERE food_id = ?',
            [review.food_id]
        );
        const newAvgRating = avgResult[0].avgRating || 0.00;

        // Update avg_rating di tabel foods
        await db.query(
            'UPDATE foods SET avg_rating = ? WHERE id = ?',
            [newAvgRating, review.food_id]
        );

        res.json({ message: 'Ulasan berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createReview, getReviewsByFood, deleteReview };
