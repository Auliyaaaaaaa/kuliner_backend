import { DatabaseService } from '../database/database.service';
export declare class ReviewService {
    private readonly db;
    constructor(db: DatabaseService);
    createReview(userId: number, body: any): Promise<{
        message: string;
    }>;
    getReviewsByFood(foodId: string): Promise<any>;
    deleteReview(reviewId: string, userId: number, userRole: string): Promise<{
        message: string;
    }>;
    private recalculateFoodAvgRating;
}
