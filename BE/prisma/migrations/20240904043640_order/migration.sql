/*
  Warnings:

  - You are about to drop the column `price_at_order` on the `order` table. All the data in the column will be lost.
  - Added the required column `total_price` to the `order` table without a default value. This is not possible if the table is not empty.
  - Made the column `is_deleted` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `price_at_order`,
    ADD COLUMN `total_price` INTEGER NOT NULL,
    MODIFY `is_deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `order_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price_at_order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
