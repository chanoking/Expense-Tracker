/*
  Warnings:

  - Added the required column `cuisineId` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `cuisineId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Cuisine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_cuisineId_fkey` FOREIGN KEY (`cuisineId`) REFERENCES `Cuisine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
