-- Crear base de datos
CREATE DATABASE bd_bande_dessinee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bd_bande_dessinee;

-- ======================
-- TABLA SERIES
-- ======================
CREATE TABLE series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

-- ======================
-- TABLA AUTORES
-- ======================
CREATE TABLE autores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

-- ======================
-- TABLA EDITORIALES
-- ======================
CREATE TABLE editoriales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE
);

-- ======================
-- TABLA ESTADOS
-- ======================
CREATE TABLE estados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(255) -- ruta .png
);

-- ======================
-- TABLA ALBUMES
-- ======================
CREATE TABLE albumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    serie_id INT,
    editorial_id INT NULL,
    estado_id INT,
    tieneslu BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (serie_id) REFERENCES series(id),
    FOREIGN KEY (editorial_id) REFERENCES editoriales(id),
    FOREIGN KEY (estado_id) REFERENCES estados(id)
);

-- ======================
-- RELACIÓN N:M ALBUM - AUTOR
-- ======================
CREATE TABLE album_autor (
    album_id INT,
    autor_id INT,
    PRIMARY KEY (album_id, autor_id),
    FOREIGN KEY (album_id) REFERENCES albumes(id) ON DELETE CASCADE,
    FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE
);

-- ======================
-- INSERT SERIES
-- ======================
INSERT INTO series (nombre) VALUES
('Natacha'),
('Yoko Tsuno'),
('Blake & Mortimer'),
('Blacksad');

-- ======================
-- INSERT AUTORES
-- ======================
INSERT INTO autores (nombre) VALUES
('Walthéry'),
('Roger Leloup'),
('E.P. Jacobs'),
('Juan Díaz Canales'),
('Juanjo Guarnido');

-- ======================
-- INSERT EDITORIALES
-- ======================
INSERT INTO editoriales (nombre) VALUES
('Dupuis');

-- ======================
-- INSERT ESTADOS
-- ======================
INSERT INTO estados (nombre, descripcion, icono) VALUES
('Nuevu', 'Estado perfecto, como recién comprado', 'icons/nuevu.png'),
('Como nuevu', 'Muy poco uso, casi perfecto', 'icons/como_nuevu.png'),
('Bon estáu', 'Buen estado general con leves marcas', 'icons/bon_estau.png'),
('Gastáu', 'Uso evidente, desgaste visible', 'icons/gastau.png'),
('Desconocido', 'Estado no especificado', 'icons/desconocido.png');

-- ======================
-- INSERT ÁLBUMES
-- ======================

-- Natacha (editorial Dupuis)
INSERT INTO albumes (titulo, serie_id, editorial_id, estado_id, tieneslu) VALUES
('Natacha hôtesse de l''air', 1, 1, 1, FALSE),
('Natacha et le Maharadjah', 1, 1, 2, FALSE),
('La Mémoire de métal', 1, 1, 3, FALSE),
('Un trône pour Natacha', 1, 1, 4, FALSE),
('Double vol', 1, 1, 1, FALSE),
('Un brin de panique', 1, 1, 1, FALSE),
('L''Ange blond', 1, 1, 1, FALSE),
('Les Machines incertaines', 1, 1, 1, FALSE),
('L''Ile d''outre-monde', 1, 1, 3, FALSE),
('Cauchemirage', 1, 1, 3, FALSE),
('Le Grand pari', 1, 1, 3, TRUE),
('La Ceinture de Cherchemidi', 1, 1, 2, FALSE),
('Kerguelen', 1, 1, 2, FALSE),
('Les Culottes de fer', 1, 1, 2, FALSE),
('Natacha et les petits anges', 1, 1, 2, FALSE),
('Au septième ciel', 1, 1, 2, FALSE),
('La Veuve noire', 1, 1, 2, FALSE),
('Natacha et les dinosaures', 1, 1, 1, FALSE),
('La Mer de rochers', 1, 1, 1, FALSE),
('Atoll 66', 1, 1, 1, FALSE),
('Le Regard du passé', 1, 1, 1, FALSE),
('L''Épervier bleu', 1, 1, 1, FALSE),
('Sur les traces de l''Épervier bleu', 1, 1, 3, FALSE),
('Chanson d''avril', 1, 1, 1, FALSE),
('Le Grand pari (duplicado)', 1, 1, 4, FALSE);

-- Yoko Tsuno
INSERT INTO albumes (titulo, serie_id, editorial_id, estado_id, tieneslu) VALUES
('Le Trio de l''étrange', 2, NULL, 5, FALSE),
('L''Orgue du diable', 2, NULL, 5, FALSE),
('La Forge de Vulcain', 2, NULL, 5, FALSE),
('Aventures électroniques', 2, NULL, 5, FALSE),
('Message pour l''éternité', 2, NULL, 5, FALSE);

-- Blake & Mortimer
INSERT INTO albumes (titulo, serie_id, editorial_id, estado_id, tieneslu) VALUES
('Le Secret de l''Espadon Tome 1', 3, NULL, 5, FALSE),
('Le Secret de l''Espadon Tome 2', 3, NULL, 5, FALSE);

-- Blacksad
INSERT INTO albumes (titulo, serie_id, editorial_id, estado_id, tieneslu) VALUES
('Un Lugar entre las Sombras', 4, NULL, 5, FALSE),
('Arctic Nation', 4, NULL, 5, FALSE);

-- ======================
-- RELACIONES ÁLBUM-AUTOR
-- ======================

-- Natacha → Walthéry
INSERT INTO album_autor (album_id, autor_id)
SELECT id, 1 FROM albumes WHERE serie_id = 1;

-- Yoko Tsuno → Roger Leloup
INSERT INTO album_autor (album_id, autor_id)
SELECT id, 2 FROM albumes WHERE serie_id = 2;

-- Blake & Mortimer → E.P. Jacobs
INSERT INTO album_autor (album_id, autor_id)
SELECT id, 3 FROM albumes WHERE serie_id = 3;

-- Blacksad → 2 autores
INSERT INTO album_autor (album_id, autor_id)
SELECT id, 4 FROM albumes WHERE serie_id = 4;

INSERT INTO album_autor (album_id, autor_id)
SELECT id, 5 FROM albumes WHERE serie_id = 4;