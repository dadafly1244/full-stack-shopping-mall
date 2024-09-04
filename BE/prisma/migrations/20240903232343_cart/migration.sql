/*
  Warnings:

  - You are about to drop the column `count` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `is_ordered` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the `_OrderToCart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_OrderToCart` DROP FOREIGN KEY `_OrderToCart_A_fkey`;

-- DropForeignKey
ALTER TABLE `_OrderToCart` DROP FOREIGN KEY `_OrderToCart_B_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `count`,
    DROP COLUMN `is_ordered`,
    ADD COLUMN `is_selected` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `order_id` VARCHAR(191) NULL,
    ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `_OrderToCart`;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
