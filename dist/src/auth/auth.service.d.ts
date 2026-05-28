import { DatabaseService } from '../database/database.service';
export declare class AuthService {
    private readonly db;
    constructor(db: DatabaseService);
    register(body: any): Promise<{
        message: string;
    }>;
    registerAdmin(body: any): Promise<{
        message: string;
    }>;
    login(body: any): Promise<{
        message: string;
        token: string;
        user: {
            id: any;
            username: any;
            name: any;
            role: any;
        };
    }>;
}
