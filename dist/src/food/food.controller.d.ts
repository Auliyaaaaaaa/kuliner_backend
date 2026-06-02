import { FoodService } from './food.service';
export declare class FoodController {
    private readonly foodService;
    constructor(foodService: FoodService);
    getAll(query: any): Promise<any>;
    getPending(): Promise<any>;
    getById(id: string): Promise<any>;
    create(body: any): Promise<{
        message: string;
    }>;
    submit(body: any, req: any): Promise<{
        message: string;
    }>;
    approve(id: string): Promise<{
        message: string;
    }>;
    reject(id: string): Promise<{
        message: string;
    }>;
    update(id: string, body: any): Promise<{
        message: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
