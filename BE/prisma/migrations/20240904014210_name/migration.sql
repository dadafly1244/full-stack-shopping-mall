/*
  Warnings:

  - You are about to drop the column `is_selected` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `cart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_order_id_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `is_selected`,
    DROP COLUMN `order_id`,
    DROP COLUMN `quantity`,
    ADD COLUMN `count` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `is_ordered` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `_OrderToCart` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_OrderToCart_AB_unique`(`A`, `B`),
    INDEX `_OrderToCart_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_OrderToCart` ADD CONSTRAINT `_OrderToCart_A_fkey` FOREIGN KEY (`A`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderToCart` ADD CONSTRAINT `_OrderToCart_B_fkey` FOREIGN KEY (`B`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
