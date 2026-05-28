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
exports.FoodService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let FoodService = class FoodService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getAllFoods(query) {
        const { category, minPrice, maxPrice, search, sort } = query;
        let sql = `
      SELECT foods.*, categories.name as category_name 
      FROM foods 
      LEFT JOIN categories ON foods.category_id = categories.id
      WHERE 1=1
    `;
        const params = [];
        if (category) {
            sql += ' AND foods.category_id = ?';
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
            sql += ' ORDER BY foods.avg_rating DESC';
        }
        const [foods] = await this.db.query(sql, params);
        return foods;
    }
    async getFoodById(id) {
        const [foods] = await this.db.query(`SELECT foods.*, categories.name as category_name 
       FROM foods 
       LEFT JOIN categories ON foods.category_id = categories.id
       WHERE foods.id = ?`, [id]);
        if (foods.length === 0) {
            throw new common_1.NotFoundException('Makanan tidak ditemukan!');
        }
        return foods[0];
    }
    async createFood(body) {
        const { name, description, price, image_url, category_id } = body;
        if (!name || !price || !category_id) {
            throw new common_1.BadRequestException('Nama, harga, dan kategori wajib diisi!');
        }
        await this.db.query('INSERT INTO foods (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)', [name, description || null, price, image_url || null, category_id]);
        return { message: 'Makanan berhasil ditambahkan!' };
    }
    async updateFood(id, body) {
        const { name, description, price, image_url, category_id } = body;
        const [existing] = await this.db.query('SELECT * FROM foods WHERE id = ?', [id]);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Makanan tidak ditemukan!');
        }
        await this.db.query('UPDATE foods SET name=?, description=?, price=?, image_url=?, category_id=? WHERE id=?', [
            name !== undefined ? name : existing[0].name,
            description !== undefined ? description : existing[0].description,
            price !== undefined ? price : existing[0].price,
            image_url !== undefined ? image_url : existing[0].image_url,
            category_id !== undefined ? category_id : existing[0].category_id,
            id,
        ]);
        return { message: 'Makanan berhasil diupdate!' };
    }
    async deleteFood(id) {
        const [existing] = await this.db.query('SELECT * FROM foods WHERE id = ?', [id]);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Makanan tidak ditemukan!');
        }
        await this.db.query('DELETE FROM foods WHERE id = ?', [id]);
        return { message: 'Makanan berhasil dihapus!' };
    }
};
exports.FoodService = FoodService;
exports.FoodService = FoodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], FoodService);
//# sourceMappingURL=food.service.js.map