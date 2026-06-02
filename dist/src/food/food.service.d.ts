import { DatabaseService } from '../database/database.service';
export declare class FoodService {
    private readonly db;
    constructor(db: DatabaseService);
    getAllFoods(query: any): Promise<any>;
    getFoodById(id: string): Promise<any>;
    createFood(body: any): Promise<{
        message: string;
    }>;
    updateFood(id: string, body: any): Promise<{
        message: string;
    }>;
    deleteFood(id: string): Promise<{
        message: string;
    }>;
    submitFood(body: any, userId: number): Promise<{
        message: string;
    }>;
    getPendingFoods(): Promise<any>;
    approveFood(id: string): Promise<{
        message: string;
    }>;
    rejectFood(id: string): Promise<{
        message: string;
    }>;
}
