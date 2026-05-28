import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CategoryService {
  constructor(private readonly db: DatabaseService) {}

  async getAllCategories() {
    const [categories] = await this.db.query('SELECT * FROM categories');
    return categories;
  }

  async createCategory(name: string) {
    if (!name) {
      throw new BadRequestException('Nama kategori tidak boleh kosong!');
    }

    await this.db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return { message: 'Kategori berhasil ditambahkan!' };
  }

  async deleteCategory(id: string) {
    const [existing] = await this.db.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundException('Kategori tidak ditemukan!');
    }

    await this.db.query('DELETE FROM categories WHERE id = ?', [id]);
    return { message: 'Kategori berhasil dihapus!' };
  }
}
