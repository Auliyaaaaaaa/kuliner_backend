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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let UserService = class UserService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getAllUsers() {
        const [users] = await this.db.query('SELECT id, username, name, customerNumber, address, phone, role, createdAt FROM users WHERE role = ? ORDER BY createdAt DESC', ['USER']);
        return users;
    }
    async getUserById(id) {
        const [users] = await this.db.query('SELECT id, username, name, customerNumber, address, phone, role, createdAt FROM users WHERE id = ? AND role = ?', [id, 'USER']);
        if (users.length === 0) {
            throw new common_1.NotFoundException('Customer tidak ditemukan!');
        }
        return users[0];
    }
    async deleteUser(id) {
        const [existing] = await this.db.query('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'USER']);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Customer tidak ditemukan!');
        }
        await this.db.query('DELETE FROM users WHERE id = ?', [id]);
        return { message: 'Customer berhasil dihapus!' };
    }
    async getAllAdmins() {
        const [users] = await this.db.query('SELECT id, username, name, address, phone, role, createdAt FROM users WHERE role = ? ORDER BY createdAt DESC', ['ADMIN']);
        return users;
    }
    async getAdminById(id) {
        const [users] = await this.db.query('SELECT id, username, name, address, phone, role, createdAt FROM users WHERE id = ? AND role = ?', [id, 'ADMIN']);
        if (users.length === 0) {
            throw new common_1.NotFoundException('Admin tidak ditemukan!');
        }
        return users[0];
    }
    async deleteAdmin(id) {
        const [existing] = await this.db.query('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'ADMIN']);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Admin tidak ditemukan!');
        }
        await this.db.query('DELETE FROM users WHERE id = ?', [id]);
        return { message: 'Admin berhasil dihapus!' };
    }
    async updateAdmin(id, body) {
        const { username, name, address, phone } = body;
        const [existing] = await this.db.query('SELECT * FROM users WHERE id = ? AND role = ?', [id, 'ADMIN']);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Admin tidak ditemukan!');
        }
        if (username && username !== existing[0].username) {
            const [usernameCheck] = await this.db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, id]);
            if (usernameCheck.length > 0) {
                throw new common_1.BadRequestException('Username sudah digunakan!');
            }
        }
        const newUsername = username || existing[0].username;
        const newName = name || existing[0].name;
        const newAddress = address || existing[0].address;
        const newPhone = phone || existing[0].phone;
        await this.db.query('UPDATE users SET username = ?, name = ?, address = ?, phone = ? WHERE id = ?', [newUsername, newName, newAddress, newPhone, id]);
        return { message: 'Data admin berhasil diupdate!' };
    }
    async getMyProfile(userId) {
        const [users] = await this.db.query('SELECT id, username, name, customerNumber, address, phone, role, createdAt FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            throw new common_1.NotFoundException('User tidak ditemukan!');
        }
        return users[0];
    }
    async updateMyProfile(userId, body) {
        const { username, name, address, phone } = body;
        if (!username && !name && !address && !phone) {
            throw new common_1.BadRequestException('Minimal isi satu field!');
        }
        const [existing] = await this.db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (existing.length === 0) {
            throw new common_1.NotFoundException('User tidak ditemukan!');
        }
        if (username && username !== existing[0].username) {
            const [usernameCheck] = await this.db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
            if (usernameCheck.length > 0) {
                throw new common_1.BadRequestException('Username sudah digunakan user lain!');
            }
        }
        const newUsername = username || existing[0].username;
        const newName = name || existing[0].name;
        const newAddress = address || existing[0].address;
        const newPhone = phone || existing[0].phone;
        await this.db.query('UPDATE users SET username = ?, name = ?, address = ?, phone = ? WHERE id = ?', [newUsername, newName, newAddress, newPhone, userId]);
        return { message: 'Profil berhasil diupdate!' };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UserService);
//# sourceMappingURL=user.service.js.map