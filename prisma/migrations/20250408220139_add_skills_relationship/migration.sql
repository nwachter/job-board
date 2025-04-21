/*
  Warnings:

  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'RECRUITER', 'USER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `Skill` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Skill_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSkill` (
    `user_id` INTEGER NOT NULL,
    `skill_id` INTEGER NOT NULL,

    PRIMARY KEY (`user_id`, `skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OfferSkill` (
    `offer_id` INTEGER NOT NULL,
    `skill_id` INTEGER NOT NULL,

    PRIMARY KEY (`offer_id`, `skill_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_location_id_fkey` FOREIGN KEY (`location_id`) REFERENCES `Location`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offer` ADD CONSTRAINT `Offer_recruiter_id_fkey` FOREIGN KEY (`recruiter_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Application` ADD CONSTRAINT `Application_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkill` ADD CONSTRAINT `UserSkill_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserSkill` ADD CONSTRAINT `UserSkill_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfferSkill` ADD CONSTRAINT `OfferSkill_offer_id_fkey` FOREIGN KEY (`offer_id`) REFERENCES `Offer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OfferSkill` ADD CONSTRAINT `OfferSkill_skill_id_fkey` FOREIGN KEY (`skill_id`) REFERENCES `Skill`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `application` RENAME INDEX `Application_offer_id_fkey` TO `Application_offer_id_idx`;

-- RenameIndex
ALTER TABLE `application` RENAME INDEX `Application_user_id_fkey` TO `Application_user_id_idx`;

-- RenameIndex
ALTER TABLE `offer` RENAME INDEX `Offer_location_id_fkey` TO `Offer_location_id_idx`;

-- RenameIndex
ALTER TABLE `offer` RENAME INDEX `Offer_recruiter_id_fkey` TO `Offer_recruiter_id_idx`;
