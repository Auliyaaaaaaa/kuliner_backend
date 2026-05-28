import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllAdmins(): Promise<any>;
    getAdminById(id: string): Promise<any>;
    deleteAdmin(id: string): Promise<{
        message: string;
    }>;
    updateAdmin(id: string, body: any): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<any>;
    getUserById(id: string): Promise<any>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getMyProfile(req: any): Promise<any>;
    updateMyProfile(req: any, body: any): Promise<{
        message: string;
    }>;
}
