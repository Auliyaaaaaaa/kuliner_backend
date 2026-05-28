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
}
