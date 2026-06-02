"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let ReviewService = class ReviewService {
    db;
    constructor(db) {
        this.db = db;
    }
    async createReview(userId, body) {
        const { food_id, rating, comment } = body;
        if (!food_id || !rating) {
            throw new common_1.BadRequestException('Food ID dan rating wajib diisi!');
        }
        if (rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('Rating harus bernilai antara 1 sampai 5!');
        }
        const [food] = await this.db.query('SELECT * FROM foods WHERE id = ?', [food_id]);
        if (food.length === 0) {
            throw new common_1.NotFoundException('Makanan tidak ditemukan!');
        }
        await this.db.query('INSERT INTO reviews (userId, foodId, rating, comment) VALUES (?, ?, ?, ?)', [userId, food_id, rating, comment || null]);
        await this.recalculateFoodAvgRating(food_id);
        return { message: 'Ulasan berhasil ditambahkan!' };
    }
    async getAllReviews() {
        const [reviews] = await this.db.query(`SELECT reviews.*, users.name as user_name, foods.name as food_name
       FROM reviews
       LEFT JOIN users ON reviews.userId = users.id
       LEFT JOIN foods ON reviews.foodId = foods.id
       ORDER BY reviews.createdAt DESC`);
        return reviews;
    }
    async getReviewsByFood(foodId) {
        const [reviews] = await this.db.query(`SELECT reviews.*, users.name as user_name 
       FROM reviews 
       LEFT JOIN users ON reviews.userId = users.id 
       WHERE reviews.foodId = ? 
       ORDER BY reviews.createdAt DESC`, [foodId]);
        return reviews;
    }
    async deleteReview(reviewId, userId, userRole) {
        const [existing] = await this.db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Ulasan tidak ditemukan!');
        }
        const review = existing[0];
        if (Number(review.userId) !== Number(userId) && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('Akses ditolak! Kamu tidak bisa menghapus ulasan orang lain.');
        }
        await this.db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
        await this.recalculateFoodAvgRating(review.foodId);
        return { message: 'Review berhasil dihapus!' };
    }
    async recalculateFoodAvgRating(foodId) {
        const [avgResult] = await this.db.query('SELECT AVG(rating) as avgRating FROM reviews WHERE foodId = ?', [foodId]);
        const newAvgRating = avgResult[0].avgRating || 0.00;
        await this.db.query('UPDATE foods SET avgRating = ? WHERE id = ?', [newAvgRating, foodId]);
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ReviewService);
//# sourceMappingURL=review.service.js.map