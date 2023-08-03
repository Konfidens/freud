-- CreateTable
CREATE TABLE `Chat` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Message_chatId_id_idx`(`chatId`, `id`),
    PRIMARY KEY (`chatId`, `id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Source` (
    `id` INTEGER NOT NULL,
    `author` VARCHAR(191) NULL,
    `content` TEXT NOT NULL,
    `title` VARCHAR(191) NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `messageId` INTEGER NOT NULL,

    INDEX `Source_chatId_messageId_id_idx`(`chatId`, `messageId`, `id`),
    PRIMARY KEY (`chatId`, `messageId`, `id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `thumb` ENUM('up', 'down', 'none') NOT NULL,
    `comment` TEXT NULL,
    `chatId` VARCHAR(191) NOT NULL,
    `messageId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Feedback_chatId_messageId_idx`(`chatId`, `messageId`),
    PRIMARY KEY (`chatId`, `messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
