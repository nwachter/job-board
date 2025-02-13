/*
  Warnings:

  - You are about to drop the column `user_id` on the `offer` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_id` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Application_offer_id_fkey` ON `application`;

-- DropIndex
DROP INDEX `Offer_user_id_fkey` ON `offer`;

-- AlterTable
ALTER TABLE `application` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `offer` DROP COLUMN `user_id`,
    ADD COLUMN `admin_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` VARCHAR(191) NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
