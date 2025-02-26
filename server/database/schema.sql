-- SQLBook: Code
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema goat_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema goat_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `goat_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `goat_db` ;

-- -----------------------------------------------------
-- Table `goat_db`.`main_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`main_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`sub_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`sub_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`goat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`goat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lastname` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(255) NOT NULL,
  `born_at` DATE NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `picture` VARCHAR(255) NOT NULL,
  `presentation` TEXT NOT NULL,
  `video` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`advert`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`advert` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `description` TEXT NOT NULL,
  `goat_id` INT NULL DEFAULT NULL,
  `main_tag_id` INT NOT NULL,
  `sub_tag_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `advert_id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_goat_id_idx` (`goat_id` ASC) VISIBLE,
  INDEX `fk_advert_main_tag1_idx` (`main_tag_id` ASC) VISIBLE,
  INDEX `fk_advert_sub_tag1_idx` (`sub_tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_advert_main_tag1`
    FOREIGN KEY (`main_tag_id`)
    REFERENCES `goat_db`.`main_tag` (`id`),
  CONSTRAINT `fk_advert_sub_tag1`
    FOREIGN KEY (`sub_tag_id`)
    REFERENCES `goat_db`.`sub_tag` (`id`),
  CONSTRAINT `fk_goat_id`
    FOREIGN KEY (`goat_id`)
    REFERENCES `goat_db`.`goat` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`main_sub_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`main_sub_tag` (
  `main_tag_id` INT NULL DEFAULT NULL,
  `sub_tag_id` INT NULL DEFAULT NULL,
  INDEX `fk_main_tag_id_idx` (`main_tag_id` ASC) VISIBLE,
  INDEX `fk_sub_tag_id_idx` (`sub_tag_id` ASC) VISIBLE,
  CONSTRAINT `fk_main_tag_id`
    FOREIGN KEY (`main_tag_id`)
    REFERENCES `goat_db`.`main_tag` (`id`),
  CONSTRAINT `fk_sub_tag_id`
    FOREIGN KEY (`sub_tag_id`)
    REFERENCES `goat_db`.`sub_tag` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `goat_db`.`slot`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `goat_db`.`slot` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_at` DATETIME NOT NULL,
  `duration` INT,
  `meet_link` VARCHAR(255) DEFAULT NULL,
  `comment` TEXT NULL DEFAULT NULL,
  `advert_id` INT NOT NULL,
  `goat_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_advert_id_idx` (`advert_id` ASC) VISIBLE,
  INDEX `fk_goat_id_idx` (`goat_id` ASC) VISIBLE,
  CONSTRAINT `fk_advert_id`
    FOREIGN KEY (`advert_id`)
    REFERENCES `goat_db`.`advert` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_slot_goat_id`
    FOREIGN KEY (`goat_id`)
    REFERENCES `goat_db`.`goat` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

insert into goat(id, lastname, firstname, born_at, email, password, picture, presentation, video)
values
 (1, "Valjean", "Jean", "1984-01-01", "jean.valjean@mail.com", "123456", "https://www.zoologiste.com/images/xl/chevre.jpg", "Salut, moi c’est Jean, j’ai 24 ans et je suis étudiant en 2ème année en Histoire classique à Paris Sorbonne.", "https://www.youtube.com/watch?v=3wvatkyji1w"),
 (2, "Martin", "Julie", "1999-12-24", "julie.martin@mail.com", "abcd", "https://media.istockphoto.com/id/177369626/fr/photo/dr%C3%B4le-de-ch%C3%A8vre-envoie-sa-languette.jpg?s=612x612&w=0&k=20&c=qi4mhhIVM80vPLFztpO9ki0mO-6YwQXOifq72TyW7Tw=", "Hello, je suis Julie, j'aime la vie et manger.", NULL);

INSERT INTO main_tag (name)
VALUES
  ('Maths'),
  ('Français'),
  ('Histoire géographie'),
  ('Sciences'),
  ('Langues'),
  ('Culture'),
  ('Musique'),
  ('Art & design'),
  ('Numérique'),
  ('Développement personnel'),
  ('Finance / Administratif'),
  ('Sport'),
  ('Santé / Bien-être'),
  ('Voyage'),
  ('Autres');

-- Insérer les sub_tags avec leurs main_tags correspondants
INSERT INTO sub_tag (name)
VALUES
  -- Maths
('Géométrie'),
('Algèbre'),
('Statistiques et probabilités'),
('Analyse'),
('Arithmétique'),
('Logique et raisonnement'),
('Maths appliquées'),

-- Français
('Grammaire'),
('Conjugaison'),
('Orthographe'),
('Rédaction'),
('Analyse littéraire'),
('Littérature'),
('Poésie'),
('Prise de parole'),

-- Histoire géographie
('Histoire ancienne'),
('Histoire moderne'),
('Géopolitique'),
('Cartographie'),
('Enjeux environnementaux'),
('Civilisations'),
('Personnages historiques'),
('Histoire locale'),

-- Sciences
('S.V.T.'),
('Physique'),
('Chimie'),
('Sciences avancées'),
('Ingénierie'),
('Astronomie'),
('Neurosciences'),

-- Langues
('Anglais'),
('Espagnol'),
('Allemand'),
('Portuguais'),
('Italien'),
('Chinois'),
('Japonais'),
('Coréen'),

-- Culture
('Histoire de l’art'),
('Cinéma et audiovisuel'),
('Traditions et folklore'),
('Mythologie et légendes'),
('Sciences humaines'),
('Philosophie'),
('Médias et actualités'),

-- Musique
('Solfège'),
('Instruments'),
('Chant'),
('Composition'),
('Musique électronique'),
('Histoire de la musique'),
('Genres musicaux'),

-- Art & design
('Arts plastiques'),
('Design graphique'),
('Architecture'),
('Sculpture'),
('Photographie'),
('Mode et textile'),

-- Numérique
('Programmation'),
('Création de sites web'),
('Marketing digital'),
('IA et machine learning'),
('Cybersécurité'),
('Logiciels informatiques'),
('Analyse de données'),

-- Développement personnel
('Gestion du temps'),
('Communication'),
('Leadership'),
('Coaching de vie'),
('Créativité'),

-- Finance / Administratif
('Comptabilité'),
('Épargne et investissement'),
('Fiscalité et impôts'),
('Gestion d’entreprise'),
('Documents administratifs'),
('Gestion des dettes et crédits'),
('Création de budgets'),
('Éducation financière'),

-- Sport
('Musculation et fitness'),
('Yoga et pilates'),
('Préparation physique'),
('Nutrition sportive'),
('Équipements et techniques'),
('Coaching'),

-- Santé / Bien-être
('Nutrition'),
('Méditation et relaxation'),
('Santé mentale'),
('Médecine douce'),
('Premiers secours'),
('Soins du corps'),
('Sommeil'),
('Gestes et postures'),

-- Voyage
('Guides de voyage'),
('Voyager pas cher'),
('Voyager durablement'),
('Cultures et traditions'),
('Organisation et logistique'),
('Conseils pour expatriés'),
('Exploration insolite'),

-- Autres
('Autres');

INSERT INTO main_sub_tag (main_tag_id, sub_tag_id)
VALUES
  -- Maths
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),

  -- Français
  (2, 8),
  (2, 9),
  (2, 10),
  (2, 11),
  (2, 12),
  (2, 13),
  (2, 14),
  (2, 15),

  -- Histoire géographie
  (3, 16),
  (3, 17),
  (3, 18),
  (3, 19),
  (3, 20),
  (3, 21),
  (3, 22),
  (3, 23),

  -- Sciences
  (4, 24),
  (4, 25),
  (4, 26),
  (4, 27),
  (4, 28),
  (4, 29),
  (4, 30),

  -- Langues
  (5, 31),
  (5, 32),
  (5, 33),
  (5, 34),
  (5, 35),
  (5, 36),
  (5, 37),
  (5, 38),

  -- Culture
  (6, 39),
  (6, 40),
  (6, 41),
  (6, 42),
  (6, 43),
  (6, 44),
  (6, 45),

  -- Musique
  (7, 46),
  (7, 47),
  (7, 48),
  (7, 49),
  (7, 50),
  (7, 51),
  (7, 52),

  -- Art & design
  (8, 53),
  (8, 54),
  (8, 55),
  (8, 56),
  (8, 57),
  (8, 58),

  -- Numérique
  (9, 59),
  (9, 60),
  (9, 61),
  (9, 62),
  (9, 63),
  (9, 64),
  (9, 65),

  -- Développement personnel
  (10, 66),
  (10, 67),
  (10, 68),
  (10, 69),
  (10, 70),

  -- Finance / Administratif
  (11, 71),
  (11, 72),
  (11, 73),
  (11, 74),
  (11, 75),
  (11, 76),
  (11, 77),
  (11, 78),

  -- Sport
  (12, 79),
  (12, 80),
  (12, 81),
  (12, 82),
  (12, 83),
  (12, 84),

  -- Santé / Bien-être
  (13, 85),
  (13, 86),
  (13, 87),
  (13, 88),
  (13, 89),
  (13, 90),
  (13, 91),
  (13, 92),

  -- Voyage
  (14, 93),
  (14, 94),
  (14, 95),
  (14, 96),
  (14, 97),
  (14, 98),
  (14, 99),

  -- Autres
  (15, 100);
