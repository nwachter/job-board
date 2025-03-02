/*
  Warnings:

  - Made the column `contract_type` on table `offer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location_id` on table `offer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Application_offer_id_fkey` ON `application`;

-- DropIndex
DROP INDEX `Application_user_id_fkey` ON `application`;

-- DropIndex
DROP INDEX `Offer_location_id_fkey` ON `offer`;

-- DropIndex
DROP INDEX `Offer_recruiter_id_fkey` ON `offer`;

-- AlterTable
ALTER TABLE `offer` MODIFY `contract_type` VARCHAR(191) NOT NULL,
    MODIFY `location_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_recruiter_id_fkey` FOREIGN KEY (`recruiter_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
