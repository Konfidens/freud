-- CreateTable
CREATE TABLE `Document` (
    `index` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `filetype` ENUM('epub', 'json', 'pdf') NOT NULL,
    `author` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,

    PRIMARY KEY (`index`, `filename`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
