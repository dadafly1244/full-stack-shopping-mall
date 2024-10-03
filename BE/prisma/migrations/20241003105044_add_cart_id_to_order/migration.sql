-- AlterTable
ALTER TABLE `order` ADD COLUMN `cart_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
