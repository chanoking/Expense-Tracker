-- AlterTable
ALTER TABLE `Expense` ADD COLUMN `medicalId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_medicalId_fkey` FOREIGN KEY (`medicalId`) REFERENCES `Medical`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
