/*
  Warnings:

  - Added the required column `location` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Application_offer_id_fkey` ON `application`;

-- DropIndex
DROP INDEX `Offer_user_id_fkey` ON `offer`;

-- AlterTable
ALTER TABLE `offer` ADD COLUMN `location` VARCHAR(191) NOT NULL,
    ADD COLUMN `salary` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
