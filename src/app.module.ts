import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { FoodModule } from './food/food.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CategoryModule,
    FoodModule,
    ReviewModule,
    UserModule,
  ],
})
export class AppModule { }