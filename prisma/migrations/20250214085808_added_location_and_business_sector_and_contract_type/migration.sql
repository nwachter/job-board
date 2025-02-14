/*
  Warnings:

  - You are about to drop the column `admin_id` on the `offer` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `offer` table. All the data in the column will be lost.
  - Added the required column `recruiter_id` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Application_offer_id_fkey` ON `application`;

-- DropIndex
DROP INDEX `Application_user_id_fkey` ON `application`;

-- DropIndex
DROP INDEX `Offer_admin_id_fkey` ON `offer`;

-- AlterTable
ALTER TABLE `offer` DROP COLUMN `admin_id`,
    DROP COLUMN `location`,
    ADD COLUMN `contract_type` VARCHAR(191) NULL,
    ADD COLUMN `location_id` INTEGER NULL,
    ADD COLUMN `recruiter_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `avatar` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL DEFAULT 'France',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_recruiter_id_fkey` FOREIGN KEY (`recruiter_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
