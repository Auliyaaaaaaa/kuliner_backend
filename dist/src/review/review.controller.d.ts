import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    create(req: any, body: any): Promise<{
        message: string;
    }>;
    getByFood(foodId: string): Promise<any>;
    delete(req: any, id: string): Promise<{
        message: string;
    }>;
}
