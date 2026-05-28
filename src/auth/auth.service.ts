import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly db: DatabaseService) { }

  // Register customer (public)
  async register(body: any) {
    const { username, name, password, customerNumber, address, phone } = body;

    if (!username || !name || !password || !customerNumber || !address || !phone) {
      throw new BadRequestException('Semua field wajib diisi!');
    }

    const [existingUsername] = await this.db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (existingUsername.length > 0) {
      throw new BadRequestException('Username sudah terdaftar!');
    }

    const [existingNumber] = await this.db.query(
      'SELECT * FROM users WHERE customerNumber = ?',
      [customerNumber]
    );
    if (existingNumber.length > 0) {
      throw new BadRequestException('Customer number sudah terdaftar!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.query(
      'INSERT INTO users (username, name, password, customerNumber, address, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, name, hashedPassword, customerNumber, address, phone, 'USER']
    );

    return { message: 'Registrasi berhasil!' };
  }

  // Register admin (admin only)
  async registerAdmin(body: any) {
    const { username, name, password, address, phone } = body;

    if (!username || !name || !password || !address || !phone) {
      throw new BadRequestException('Semua field wajib diisi!');
    }

    const [existingUsername] = await this.db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (existingUsername.length > 0) {
      throw new BadRequestException('Username sudah terdaftar!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.db.query(
      'INSERT INTO users (username, name, password, address, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [username, name, hashedPassword, address, phone, 'ADMIN']
    );

    return { message: 'Registrasi admin berhasil!' };
  }

  // Login
  async login(body: any) {
    const { username, password } = body;

    if (!username || !password) {
      throw new BadRequestException('Username dan password wajib diisi!');
    }

    const [users] = await this.db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      throw new BadRequestException('Username atau password salah!');
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Username atau password salah!');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'rahasia_kamu_disini',
      { expiresIn: '1d' }
    );

    return {
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    };
  }
}