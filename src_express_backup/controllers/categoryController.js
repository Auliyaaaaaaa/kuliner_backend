const db = require('../config/db');

// GET semua kategori
const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// POST tambah kategori (admin only)
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nama kategori tidak boleh kosong!' });
        }

        await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
        res.status(201).json({ message: 'Kategori berhasil ditambahkan!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// DELETE hapus kategori (admin only)
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan!' });
        }

        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Kategori berhasil dihapus!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getAllCategories, createCategory, deleteCategory };