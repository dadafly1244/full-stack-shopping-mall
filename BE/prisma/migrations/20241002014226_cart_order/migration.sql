/*
  Warnings:

  - You are about to drop the column `count` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `is_ordered` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the `_OrderToCart` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_OrderToCart` DROP FOREIGN KEY `_OrderToCart_A_fkey`;

-- DropForeignKey
ALTER TABLE `_OrderToCart` DROP FOREIGN KEY `_OrderToCart_B_fkey`;

-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_product_id_fkey`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `count`,
    DROP COLUMN `is_ordered`,
    DROP COLUMN `product_id`;

-- AlterTable
ALTER TABLE `order` ALTER COLUMN `status` DROP DEFAULT;

-- DropTable
DROP TABLE `_OrderToCart`;

-- CreateTable
CREATE TABLE `cart_item` (
    `id` VARCHAR(191) NOT NULL,
    `cart_id` VARCHAR(191) NOT NULL,
    `product_id` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `cart_user_id_key` ON `cart`(`user_id`);

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart_item` ADD CONSTRAINT `cart_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
