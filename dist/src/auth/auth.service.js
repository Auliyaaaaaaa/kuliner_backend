"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
let AuthService = class AuthService {
    db;
    constructor(db) {
        this.db = db;
    }
    async register(body) {
        const { username, name, password, customerNumber, address, phone } = body;
        if (!username || !name || !password || !customerNumber || !address || !phone) {
            throw new common_1.BadRequestException('Semua field wajib diisi!');
        }
        const [existingUsername] = await this.db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsername.length > 0) {
            throw new common_1.BadRequestException('Username sudah terdaftar!');
        }
        const [existingNumber] = await this.db.query('SELECT * FROM users WHERE customerNumber = ?', [customerNumber]);
        if (existingNumber.length > 0) {
            throw new common_1.BadRequestException('Customer number sudah terdaftar!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.db.query('INSERT INTO users (username, name, password, customerNumber, address, phone, role) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, name, hashedPassword, customerNumber, address, phone, 'USER']);
        return { message: 'Registrasi berhasil!' };
    }
    async registerAdmin(body) {
        const { username, name, password, address, phone } = body;
        if (!username || !name || !password || !address || !phone) {
            throw new common_1.BadRequestException('Semua field wajib diisi!');
        }
        const [existingUsername] = await this.db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsername.length > 0) {
            throw new common_1.BadRequestException('Username sudah terdaftar!');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.db.query('INSERT INTO users (username, name, password, address, phone, role) VALUES (?, ?, ?, ?, ?, ?)', [username, name, hashedPassword, address, phone, 'ADMIN']);
        return { message: 'Registrasi admin berhasil!' };
    }
    async login(body) {
        const { username, password } = body;
        if (!username || !password) {
            throw new common_1.BadRequestException('Username dan password wajib diisi!');
        }
        const [users] = await this.db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            throw new common_1.BadRequestException('Username atau password salah!');
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.BadRequestException('Username atau password salah!');
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'rahasia_kamu_disini', { expiresIn: '1d' });
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map