-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_cuisineId_fkey`;

-- DropIndex
DROP INDEX `Expense_cuisineId_fkey` ON `Expense`;

-- AlterTable
ALTER TABLE `Expense` MODIFY `cuisineId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_cuisineId_fkey` FOREIGN KEY (`cuisineId`) REFERENCES `Cuisine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
