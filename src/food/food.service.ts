import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FoodService {
  constructor(private readonly db: DatabaseService) { }

  async getAllFoods(query: any) {
    const { category, minPrice, maxPrice, search, sort } = query;

    let sql = `
      SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.categoryId = categories.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      sql += ' AND foods.categoryId = ?';
      params.push(category);
    }
    if (minPrice) {
      sql += ' AND foods.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      sql += ' AND foods.price <= ?';
      params.push(maxPrice);
    }
    if (search) {
      sql += ' AND foods.name LIKE ?';
      params.push(`%${search}%`);
    }
    if (sort === 'rating') {
      sql += ' ORDER BY foods.avgRating DESC';
    }

    const [foods] = await this.db.query(sql, params);
    return foods;
  }

  async getFoodById(id: string) {
    const [foods] = await this.db.query(
      `SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.categoryId = categories.id
      WHERE foods.id = ?`,
      [id]
    );

    if (foods.length === 0) {
      throw new NotFoundException('Makanan tidak ditemukan!');
    }

    return foods[0];
  }

  async createFood(body: any) {
    const { name, description, price, image_url, categoryId } = body;

    if (!name || !price || !categoryId) {
      throw new BadRequestException('Nama, harga, dan kategori wajib diisi!');
    }

    await this.db.query(
      'INSERT INTO foods (name, description, price, image_url, categoryId) VALUES (?, ?, ?, ?, ?)',
      [name, description || null, price, image_url || null, categoryId]
    );

    return { message: 'Makanan berhasil ditambahkan!' };
  }

  async updateFood(id: string, body: any) {
    const { name, description, price, image_url, categoryId } = body;

    const [existing] = await this.db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundException('Makanan tidak ditemukan!');
    }

    await this.db.query(
      'UPDATE foods SET name=?, description=?, price=?, image_url=?, categoryId=? WHERE id=?',
      [
        name !== undefined ? name : existing[0].name,
        description !== undefined ? description : existing[0].description,
        price !== undefined ? price : existing[0].price,
        image_url !== undefined ? image_url : existing[0].image_url,
        categoryId !== undefined ? categoryId : existing[0].categoryId,
        id,
      ]
    );

    return { message: 'Makanan berhasil diupdate!' };
  }

  async deleteFood(id: string) {
    const [existing] = await this.db.query('SELECT * FROM foods WHERE id = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundException('Makanan tidak ditemukan!');
    }

    await this.db.query('DELETE FROM foods WHERE id = ?', [id]);
    return { message: 'Makanan berhasil dihapus!' };
  }
}