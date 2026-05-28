const db = require('../config/db');

// GET semua makanan + filter
const getAllFoods = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, sort } = req.query;

        let query = `
      SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.category_id = categories.id
      WHERE 1=1
    `;
        const params = [];

        if (category) {
            query += ' AND foods.category_id = ?';
            params.push(category);
        }
        if (minPrice) {
            query += ' AND foods.price >= ?';
            params.push(minPrice);
        }
        if (maxPrice) {
            query += ' AND foods.price <= ?';
            params.push(maxPrice);
        }
        if (search) {
            query += ' AND foods.name LIKE ?';
            params.push(`%${search}%`);
        }
        if (sort === 'rating') {
            query += ' ORDER BY foods.avg_rating DESC';
        }

        const [foods] = await db.query(query, params);
        res.json(foods);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// GET detail satu makanan
const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const [foods] = await db.query(`
      SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.category_id = categories.id
      WHERE foods.id = ?
    `, [id]);

        if (foods.length === 0) {
            return res.status(404).json({ message: 'Makanan tidak ditemukan!' });
        }

        res.json(foods[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST tambah makanan (admin only)
const createFood = async (req, res) => {
    try {
        const { name, description, price, image_url, category_id } = req.body;

        if (!name || !price || !category_id) {
            return res.status(400).json({ message: 'Nama, harga, dan kategori wajib diisi!' });
        }

        await db.query(
            'INSERT INTO foods (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image_url, category_id]
        );

        res.status(201).json({ message: 'Makanan berhasil ditambahkan!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// PUT edit makanan (admin only)
const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image_url, category_id } = req.body;

        const [existing] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Makanan tidak ditemukan!' });
        }

        await db.query(
            'UPDATE foods SET name=?, description=?, price=?, image_url=?, category_id=? WHERE id=?',
            [name, description, price, image_url, category_id, id]
        );

        res.json({ message: 'Makanan berhasil diupdate!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE hapus makanan (admin only)
const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM foods WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Makanan tidak ditemukan!' });
        }

        await db.query('DELETE FROM foods WHERE id = ?', [id]);
        res.json({ message: 'Makanan berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllFoods, getFoodById, createFood, updateFood, deleteFood };