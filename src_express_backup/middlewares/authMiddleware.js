const jwt = require('jsonwebtoken');

// Cek apakah user sudah login
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak! Token tidak ada.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid!' });
    }
};

// Cek apakah user adalah admin
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak! Hanya admin yang bisa melakukan ini.' });
        }
        next();
    });
};

module.exports = { verifyToken, verifyAdmin };