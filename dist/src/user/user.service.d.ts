import { DatabaseService } from '../database/database.service';
export declare class UserService {
    private readonly db;
    constructor(db: DatabaseService);
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getAllAdmins(): Promise<any>;
    getAdminById(id: string): Promise<any>;
    deleteAdmin(id: string): Promise<{
        message: string;
    }>;
    updateAdmin(id: string, body: any): Promise<{
        message: string;
    }>;
    getMyProfile(userId: number): Promise<any>;
    updateMyProfile(userId: number, body: any): Promise<{
        message: string;
    }>;
}
