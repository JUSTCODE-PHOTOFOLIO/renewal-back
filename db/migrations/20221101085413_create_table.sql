-- migrate:up
CREATE TABLE IF NOT EXISTS `Users` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `login_id` varchar(50) NOT NULL UNIQUE,
  `password` varchar(100) NOT NULL,
  `kor_name` varchar(50) NOT NULL,
  `eng_name` varchar(50) NOT NULL,
  `profile_image` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL UNIQUE,
  `external_email` varchar(50) UNIQUE,
  `introduction` varchar(150),
  `description` varchar(800),
  `nickname` varchar(100) NOT NULL,
  `website_url` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `User_Admin` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Works_Posting` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `category_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(255),
  `view_count` int DEFAULT "0",
  `scheduled_at` timestamp,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP,
  `status_id` int NOT NULL DEFAULT "1"
);

CREATE TABLE IF NOT EXISTS `Works_Category` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `eng_category_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `upload_file` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `posting_id` int NOT NULL,
  `file_sort_id` int NOT NULL,
  `upload_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `file_sort` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `file_sort` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT NOW(),
  `updated_at` timestamp
);

CREATE TABLE IF NOT EXISTS `public_status` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `status` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Works_Posting_tags` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `tag_id` int NOT NULL,
  `posting_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Works_tag_names` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Comment` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `posting_id` int,
  `parent_comment_id` int,
  `comment` varchar(1000),
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Works_Sympathy` (
  `id` tinyint PRIMARY KEY AUTO_INCREMENT,
  `sympathy_sort` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Works_Sympathy_Count` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `sympathy_id` tinyint NOT NULL,
  `posting_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Notice` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `User_Admin_id` int,
  `title` varchar(255),
  `content` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `Follow` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `following_id` int NOT NULL,
  `follower_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT NOW(),
  `updated_at` timestamp DEFAULT NOW() ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE `User_Admin` ADD FOREIGN KEY (`users_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Works_Posting` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Works_Posting` ADD FOREIGN KEY (`category_id`) REFERENCES `Works_Category` (`id`);

ALTER TABLE `Works_Posting` ADD FOREIGN KEY (`status_id`) REFERENCES `public_status` (`id`);

ALTER TABLE `upload_file` ADD FOREIGN KEY (`posting_id`) REFERENCES `Works_Posting` (`id`);

ALTER TABLE `upload_file` ADD FOREIGN KEY (`file_sort_id`) REFERENCES `file_sort` (`id`);

ALTER TABLE `Works_Posting_tags` ADD FOREIGN KEY (`tag_id`) REFERENCES `Works_tag_names` (`id`);

ALTER TABLE `Works_Posting_tags` ADD FOREIGN KEY (`posting_id`) REFERENCES `Works_Posting` (`id`);

ALTER TABLE `Comment` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Comment` ADD FOREIGN KEY (`posting_id`) REFERENCES `Works_Posting` (`id`);

ALTER TABLE `Comment` ADD FOREIGN KEY (`parent_comment_id`) REFERENCES `Comment` (`id`);

ALTER TABLE `Works_Sympathy_Count` ADD FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Works_Sympathy_Count` ADD FOREIGN KEY (`sympathy_id`) REFERENCES `Works_Sympathy` (`id`);

ALTER TABLE `Works_Sympathy_Count` ADD FOREIGN KEY (`posting_id`) REFERENCES `Works_Posting` (`id`);

ALTER TABLE `Notice` ADD FOREIGN KEY (`User_Admin_id`) REFERENCES `User_Admin` (`id`);

ALTER TABLE `Follow` ADD FOREIGN KEY (`following_id`) REFERENCES `Users` (`id`);

ALTER TABLE `Follow` ADD FOREIGN KEY (`follower_id`) REFERENCES `Users` (`id`);

-- migrate:down

SET foreign_key_checks = 0;

DROP TABLE Users;
DROP TABLE User_Admin;
DROP TABLE Works_Posting;
DROP TABLE Works_Category;
DROP TABLE upload_file;
DROP TABLE file_sort;
DROP TABLE public_status;
DROP TABLE Works_Posting_tags;
DROP TABLE Works_tag_names;
DROP TABLE Comment;
DROP TABLE Works_Sympathy;
DROP TABLE Works_Sympathy_Count;
DROP TABLE Notice;
DROP TABLE Follow;

SET foreign_key_checks = 1;