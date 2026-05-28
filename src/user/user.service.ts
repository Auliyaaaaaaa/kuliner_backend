import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly db: DatabaseService) { }

  // ========================
  // ADMIN - Kelola semua customer
  // ========================

  // GET semua customer (Admin only)
  async getAllUsers() {
    const [users] = await this.db.query(
      'SELECT id, username, name, customerNumber, address, phone, role, createdAt FROM users WHERE role = ? ORDER BY createdAt DESC',
      ['USER']
    );
    return users;
  }

  // GET detail satu customer by ID (Admin only)
  async getUserById(id: string) {
    const [users] = await this.db.query(
      'SELECT id, username, name, customerNumber, address, phone, role, createdAt FROM users WHERE id = ? AND role = ?',
      [id, 'USER']
    );
    if (users.length === 0) {
      throw new NotFoundException('Customer tidak ditemukan!');
    }
    return users[0];
  }

  // DELETE hapus customer (Admin only)
  async deleteUser(id: string) {
    const [existing] = await this.db.query(
      'SELECT * FROM users WHERE id = ? AND role = ?',
      [id, 'USER']
    );
    if (existing.length === 0) {
      throw new NotFoundException('Customer tidak ditemukan!');
    }

    await this.db.query('DELETE FROM users WHERE id = ?', [id]);
    return { message: 'Customer berhasil dihapus!' };
  }

  // GET semua admin
  async getAllAdmins() {
    const [users] = await this.db.query(
      'SELECT id, username, name, address, phone, role, createdAt FROM users WHERE role = ? ORDER BY createdAt DESC',
      ['ADMIN']
    );
    return users;
  }

  // GET detail admin by ID
  async getAdminById(id: string) {
    const [users] = await this.db.query(
      'SELECT id, username, name, address, phone, role, createdAt FROM users WHERE id = ? AND role = ?',
      [id, 'ADMIN']
    );
    if (users.length === 0) {
      throw new NotFoundException('Admin tidak ditemukan!');
    }
    return users[0];
  }

  // DELETE hapus admin
  async deleteAdmin(id: string) {
    const [existing] = await this.db.query(
      'SELECT * FROM users WHERE id = ? AND role = ?',
      [id, 'ADMIN']
    );
    if (existing.length === 0) {
      throw new NotFoundException('Admin tidak ditemukan!');
    }

    await this.db.query('DELETE FROM users WHERE id = ?', [id]);
    return { message: 'Admin berhasil dihapus!' };
  }
  // PUT update admin (Admin only)
  async updateAdmin(id: string, body: any) {
    const { username, name, address, phone } = body;

    const [existing] = await this.db.query(
      'SELECT * FROM users WHERE id = ? AND role = ?',
      [id, 'ADMIN']
    );
    if (existing.length === 0) {
      throw new NotFoundException('Admin tidak ditemukan!');
    }

    if (username && username !== existing[0].username) {
      const [usernameCheck] = await this.db.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, id]
      );
      if (usernameCheck.length > 0) {
        throw new BadRequestException('Username sudah digunakan!');
      }
    }

    const newUsername = username || existing[0].username;
    const newName = name || existing[0].name;
    const newAddress = address || existing[0].address;
    const newPhone = phone || existing[0].phone;

    await this.db.query(
      'UPDATE users SET username = ?, name = ?, address = ?, phone = ? WHERE id = ?',
      [newUsername, newName, newAddress, newPhone, id]
    );

    return { message: 'Data admin berhasil diupdate!' };
  }

  // ========================
  // CUSTOMER - Kelola profil sendiri
  // ========================

  // GET profil sendiri
  async getMyProfile(userId: number) {
    const [users] = await this.db.query(
      'SELECT id, username, name, customerNumber, address, phone, role, createdAt FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) {
      throw new NotFoundException('User tidak ditemukan!');
    }
    return users[0];
  }

  // PUT update profil sendiri (customer only)
  async updateMyProfile(userId: number, body: any) {
    const { username, name, address, phone } = body;

    if (!username && !name && !address && !phone) {
      throw new BadRequestException('Minimal isi satu field!');
    }

    const [existing] = await this.db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    if (existing.length === 0) {
      throw new NotFoundException('User tidak ditemukan!');
    }

    // Cek username baru sudah dipakai belum
    if (username && username !== existing[0].username) {
      const [usernameCheck] = await this.db.query(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, userId]
      );
      if (usernameCheck.length > 0) {
        throw new BadRequestException('Username sudah digunakan user lain!');
      }
    }

    const newUsername = username || existing[0].username;
    const newName = name || existing[0].name;
    const newAddress = address || existing[0].address;
    const newPhone = phone || existing[0].phone;

    await this.db.query(
      'UPDATE users SET username = ?, name = ?, address = ?, phone = ? WHERE id = ?',
      [newUsername, newName, newAddress, newPhone, userId]
    );

    return { message: 'Profil berhasil diupdate!' };
  }
}