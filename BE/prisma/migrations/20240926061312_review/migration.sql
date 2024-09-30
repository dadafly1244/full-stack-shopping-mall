-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `review_parent_review_id_fkey`;

-- AlterTable
ALTER TABLE `review` MODIFY `parent_review_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_parent_review_id_fkey` FOREIGN KEY (`parent_review_id`) REFERENCES `review`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
