import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewService {
  constructor(private readonly db: DatabaseService) { }

  async createReview(userId: number, body: any) {
    const { food_id, rating, comment } = body;

    // Validasi input
    if (!food_id || !rating) {
      throw new BadRequestException('Food ID dan rating wajib diisi!');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating harus bernilai antara 1 sampai 5!');
    }

    // Cek apakah makanan ada
    const [food] = await this.db.query('SELECT * FROM foods WHERE id = ?', [food_id]);
    if (food.length === 0) {
      throw new NotFoundException('Makanan tidak ditemukan!');
    }

    // Simpan ulasan ke database
    await this.db.query(
      'INSERT INTO reviews (userId, foodId, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, food_id, rating, comment || null]
    );

    // Hitung ulang dan update avg_rating untuk makanan tersebut
    await this.recalculateFoodAvgRating(food_id);

    return { message: 'Ulasan berhasil ditambahkan!' };
  }

  async getReviewsByFood(foodId: string) {
    const [reviews] = await this.db.query(
      `SELECT reviews.*, users.name as user_name 
     FROM reviews 
     LEFT JOIN users ON reviews.userId = users.id 
     WHERE reviews.foodId = ? 
     ORDER BY reviews.createdAt DESC`,
      [foodId]
    );
    return reviews;
  }

  async deleteReview(reviewId: string, userId: number, userRole: string) {
    // Cek apakah ulasan ada
    const [existing] = await this.db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
    if (existing.length === 0) {
      throw new NotFoundException('Ulasan tidak ditemukan!');
    }

    const review = existing[0];

    // Pastikan yang menghapus adalah pemilik ulasan ATAU admin
    if (review.user_id !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Akses ditolak! Kamu tidak bisa menghapus ulasan orang lain.');
    }

    // Hapus ulasan
    await this.db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);

    // Hitung ulang dan update avg_rating
    await this.recalculateFoodAvgRating(review.foodId);

    return { message: 'Ulasan berhasil dihapus!' };
  }

  // Helper untuk menghitung ulang avg_rating di tabel foods
  private async recalculateFoodAvgRating(foodId: number) {
    const [avgResult] = await this.db.query(
      'SELECT AVG(rating) as avgRating FROM reviews WHERE foodId = ?',
      [foodId]
    );
    const newAvgRating = avgResult[0].avgRating || 0.00;

    await this.db.query(
      'UPDATE foods SET avgRating = ? WHERE id = ?',
      [newAvgRating, foodId]
    );
  }
}
