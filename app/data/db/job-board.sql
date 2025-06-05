-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 05 juin 2025 à 21:54
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `job-board`
--

-- --------------------------------------------------------

--
-- Structure de la table `application`
--

DROP TABLE IF EXISTS `application`;
CREATE TABLE IF NOT EXISTS `application` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `offer_id` int NOT NULL,
  `cv` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','ACCEPTED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Application_offer_id_idx` (`offer_id`),
  KEY `Application_user_id_idx` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `application`
--

INSERT INTO `application` (`id`, `firstname`, `lastname`, `email`, `offer_id`, `cv`, `user_id`, `content`, `feedback`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 'Michael', 'Dupont', 'michael.dev@mail.com', 1, 'cv_michael_dupont.pdf', 2, 'I\'m a passionate frontend developer with 3 years of React experience. Looking forward to contributing!', NULL, 'PENDING', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(2, 'Julie', 'Martin', 'julie.frontend@mail.com', 3, 'julie_martin_cv.pdf', 4, 'Experienced in fullstack development, I am excited by this opportunity. Let\'s build great things together!', 'Great technical profile, we\'ll move forward with an interview.', 'ACCEPTED', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000');

-- --------------------------------------------------------

--
-- Structure de la table `location`
--

DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'France',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `location`
--

INSERT INTO `location` (`id`, `city`, `country`, `createdAt`, `updatedAt`) VALUES
(1, 'Paris', 'France', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(2, 'Lyon', 'France', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(3, 'Marseille', 'France', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(4, 'ioujioujh', 'France', '2025-05-08 15:21:52.176', '2025-05-08 15:21:52.176'),
(5, 'loremipsum', 'France', '2025-05-08 15:31:14.499', '2025-05-08 15:31:14.499'),
(6, 'Pau', 'France', '2025-05-08 17:21:55.792', '2025-05-08 17:21:55.792');

-- --------------------------------------------------------

--
-- Structure de la table `offer`
--

DROP TABLE IF EXISTS `offer`;
CREATE TABLE IF NOT EXISTS `offer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `salary` int NOT NULL,
  `contract_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location_id` int NOT NULL,
  `recruiter_id` int NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Offer_location_id_idx` (`location_id`),
  KEY `Offer_recruiter_id_idx` (`recruiter_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `offer`
--

INSERT INTO `offer` (`id`, `title`, `description`, `company_name`, `salary`, `contract_type`, `location_id`, `recruiter_id`, `createdAt`, `updatedAt`) VALUES
(1, 'Frontend Developer (React)', 'We\'re looking for a skilled React developer to join our dynamic product team.', 'TechHub', 45000, 'CDI', 1, 1, '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(2, 'Backend Developer (Node.js)', 'You will help us scale our APIs and optimize performance.', 'CreativeCorp', 50000, 'CDD', 2, 3, '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(3, 'Fullstack Developer (React + Node)', 'Join us to work on an exciting SaaS platform with cutting-edge technologies.', 'TechHub', 55000, 'Freelance', 1, 1, '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(4, 'lllllll', 'lllllllll', 'llllllllll', 2222, 'CDD', 6, 1, '2025-05-08 17:22:42.083', '2025-05-08 17:22:42.083');

-- --------------------------------------------------------

--
-- Structure de la table `skill`
--

DROP TABLE IF EXISTS `skill`;
CREATE TABLE IF NOT EXISTS `skill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Skill_name_key` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `skill`
--

INSERT INTO `skill` (`id`, `name`, `createdAt`, `updatedAt`, `level`) VALUES
(1, 'React', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000', NULL),
(2, 'Node.js', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000', NULL),
(3, 'TypeScript', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000', NULL),
(4, 'GraphQL', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000', NULL),
(5, 'Docker', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000', NULL),
(6, 'Python', '2025-05-08 14:49:21.942', '2025-05-08 14:49:21.942', NULL),
(8, 'test', '2025-05-08 15:21:50.765', '2025-05-08 15:21:50.765', NULL),
(9, 'kkk', '2025-05-08 15:31:13.517', '2025-05-08 15:31:13.517', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','RECRUITER','USER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `role`, `avatar`, `createdAt`, `updatedAt`) VALUES
(1, 'ninaw4c', 'ninaw4c@example.com', '$2b$10$uyixdonWPhEttums3ESEM.WlwO/wBGKH5VFi/gxXZjEY4O8kREHhC', 'RECRUITER', 'https://i.pravatar.cc/150?img=47', '2025-04-30 21:59:02.247', '2025-05-01 11:24:21.665'),
(5, 'sophie.recruiter', 'sophie@techhub.io', 'hashedpassword1', 'RECRUITER', 'https://i.pravatar.cc/150?img=47', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(2, 'michael.dev', 'michael.dev@mail.com', 'hashedpassword2', 'USER', 'https://i.pravatar.cc/150?img=32', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(3, 'lucas.hr', 'lucas.hr@creativecorp.fr', 'hashedpassword3', 'RECRUITER', 'https://i.pravatar.cc/150?img=12', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(4, 'julie.frontend', 'julie.frontend@mail.com', 'hashedpassword4', 'USER', 'https://i.pravatar.cc/150?img=54', '2025-05-01 13:18:04.000', '2025-05-01 13:18:04.000'),
(6, 'recruteur', 'recruteur@example.com', '$2b$10$Ytv0BSWPYDYwjh4ttIvXyemhRa.A7QYtirB8xntCT2yUO3w3M11vO', 'RECRUITER', NULL, '2025-05-25 15:02:32.235', '2025-05-25 15:02:32.305');

-- --------------------------------------------------------

--
-- Structure de la table `_offerskills`
--

DROP TABLE IF EXISTS `_offerskills`;
CREATE TABLE IF NOT EXISTS `_offerskills` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_OfferSkills_AB_unique` (`A`,`B`),
  KEY `_OfferSkills_B_index` (`B`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_offerskills`
--

INSERT INTO `_offerskills` (`A`, `B`) VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 5),
(3, 1),
(3, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Structure de la table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('907c7757-5c96-41b5-85b2-3791e9f99319', '7c5c87a3f4acc5460c2f85d9e53de7eaeeccf7edbf04e64c2d674afa32814a8d', '2025-04-29 20:55:15.556', '20250211151655_init', NULL, NULL, '2025-04-29 20:55:15.505', 1),
('e1f03bc9-7a22-447e-9e2f-ab41c4115507', '50fb0c160b3f43edd8ceba0b206d80988d57dba557bded2882beab140502089a', '2025-04-29 20:55:15.622', '20250212084718_init', NULL, NULL, '2025-04-29 20:55:15.556', 1),
('79bb8e7b-4db7-4115-897d-86461d209212', '2fcc8a5caed27abaff566914d5efd734df1868501ab2178c23d37a4db3e67cc6', '2025-04-29 20:55:15.691', '20250212132542_salary_location_added', NULL, NULL, '2025-04-29 20:55:15.623', 1),
('2a9aebe2-89a7-4599-85be-de869c3cea0d', 'db3aa6aafc0ee50052fedef38ec354ec082b34ab4e81520fc209533bc5686a43', '2025-04-29 20:55:15.799', '20250212142843_relations_update', NULL, NULL, '2025-04-29 20:55:15.691', 1),
('79d600e1-a1c1-4c8e-92f4-435d27373e16', '9a233c0018f71836c3c6885781b07f5308b9ef43f8348acff985914f6e0d5b39', '2025-04-29 20:55:15.872', '20250213182131_recup_on_main_pc', NULL, NULL, '2025-04-29 20:55:15.799', 1),
('a251c396-030f-4245-af57-a38428dd1628', '8c0d46fa0b92089a658c7ab2561d73bd03a309118014a948d80621c43b1ee01f', '2025-04-29 20:55:15.982', '20250214085808_added_location_and_business_sector_and_contract_type', NULL, NULL, '2025-04-29 20:55:15.872', 1),
('936f2b30-184a-4b5e-bbcf-95b6ae747182', '6aff822879bc7c37e8428d53584a322b8f22976e65aebeac116ae26759582871', '2025-04-29 20:55:16.104', '20250214164113_update', NULL, NULL, '2025-04-29 20:55:15.983', 1),
('a693aa95-2b49-4eb2-aa63-5e57a4ed8e16', '1c2f4d325e939fe31c67a31e26b88954256892fd56d2624310861611092799a3', '2025-04-29 20:55:16.214', '20250214224212_trying', NULL, NULL, '2025-04-29 20:55:16.104', 1),
('f8874605-6f5c-4aa6-aa69-98a58e67e931', '3390a31f6c9860a1d40d3108ee2a3999dbe503f21c479540b3a07b003c034719', '2025-04-29 20:55:16.311', '20250214224247_trying', NULL, NULL, '2025-04-29 20:55:16.214', 1),
('2d1e3c70-0c7c-4ccf-9343-dadf64b2050e', '3bebdfad538c9097f3874c64a34431a668215adf493470758a73b077efdb636e', '2025-04-29 20:55:16.415', '20250215183229_adding_content_to_application', NULL, NULL, '2025-04-29 20:55:16.311', 1),
('6702461d-8c63-4e54-b5b7-dc0b5d6b7d78', '809cddd18c987a71cebddd72b81a6adec96e98051f40e95598470d9846e7ba3a', '2025-04-29 20:55:16.527', '20250407130537_application_entity_add_properties_status_feedback', NULL, NULL, '2025-04-29 20:55:16.415', 1),
('98e7e8ec-da78-4750-8449-fd0dc64f6695', 'ab35f416a7762b49923d96319f18799fa35aec3a3561edff2aedf4ca310aef33', '2025-04-29 20:55:16.675', '20250408220139_add_skills_relationship', NULL, NULL, '2025-04-29 20:55:16.527', 1),
('71d6a107-c7ca-4112-ae1d-2ea3937b8531', '9056a54585bd36c4ad35ff7eb829052956c2c02049ae092655b035bbcb6060b9', '2025-04-29 20:55:16.888', '20250429093331_add_updates_and_relations', NULL, NULL, '2025-04-29 20:55:16.675', 1),
('6b7b2648-a3f0-43e3-b36a-8c27c4a19745', 'b23e65cf8c7ed15056ac46775c220bc6c761710e11e9951be665a51534a307d0', '2025-04-29 20:57:27.392', '20250429205726_maj_globale', NULL, NULL, '2025-04-29 20:57:27.301', 1),
('bba67a1b-aafb-44e9-b8c1-700398ca63e3', '9ace4df1057f5dc7b33c9b64e4a22faec42efed765d06666c4018f9a1ec5e18c', '2025-05-08 14:53:01.770', '20250508145300_add_optional_skill_level', NULL, NULL, '2025-05-08 14:53:01.627', 1);

-- --------------------------------------------------------

--
-- Structure de la table `_userskills`
--

DROP TABLE IF EXISTS `_userskills`;
CREATE TABLE IF NOT EXISTS `_userskills` (
  `A` int NOT NULL,
  `B` int NOT NULL,
  UNIQUE KEY `_UserSkills_AB_unique` (`A`,`B`),
  KEY `_UserSkills_B_index` (`B`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `_userskills`
--

INSERT INTO `_userskills` (`A`, `B`) VALUES
(2, 1),
(2, 3),
(4, 1),
(4, 2),
(4, 4);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
