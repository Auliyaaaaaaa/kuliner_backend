/*
  Warnings:

  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_userId_fkey`;

-- AlterTable
ALTER TABLE `foods` ADD COLUMN `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    ADD COLUMN `submittedBy` INTEGER NULL;

-- DropTable
DROP TABLE `reservations`;

-- AddForeignKey
ALTER TABLE `foods` ADD CONSTRAINT `foods_submittedBy_fkey` FOREIGN KEY (`submittedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
