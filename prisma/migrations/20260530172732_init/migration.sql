/*
  Warnings:

  - You are about to drop the column `image_url` on the `foods` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `users_customerNumber_key` ON `users`;

-- AlterTable
ALTER TABLE `foods` DROP COLUMN `image_url`;

-- AlterTable
ALTER TABLE `users` MODIFY `customerNumber` VARCHAR(191) NULL;
