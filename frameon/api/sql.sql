CREATE DATABASE WEB25;
USE WEB25;

CREATE TABLE USUARIO (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), dOB DATE, email VARCHAR(255), senha VARCHAR(255), role VARCHAR(20) DEFAULT 'user');
SELECT * FROM USUARIO;

CREATE TABLE FILME (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255), ano VARCHAR(10), capa VARCHAR(255));
SELECT * FROM FILME;

CREATE TABLE CATEGORIA (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL);
SELECT * FROM CATEGORIA;
INSERT INTO categoria (id, nome) VALUES (1, 'Ação'), (2, 'Comédia'), (3, 'Drama');

CREATE TABLE favorito (
  usuario_id INT,
  filme_id INT,
  PRIMARY KEY (usuario_id, filme_id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
  FOREIGN KEY (filme_id) REFERENCES filme(id) ON DELETE CASCADE
);

SELECT * FROM FAVORITO;

DESCRIBE FILME;
ALTER TABLE filme ADD COLUMN categoria_id INT;
ALTER TABLE filme ADD CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE SET NULL;

-- Adicionar filmes para testar
INSERT INTO categoria (id, nome) VALUES (4, 'Terror');
INSERT INTO categoria (id, nome) VALUES (5, 'Romance');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (1, 'Corra!', '2017', 'corra.png', '4');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (2, 'Crepúsculo', '2008', 'crepusculo.jpg', '5');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (3, 'Gente Grande', '2010', 'GenteGrande.jpg', '2');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (4, 'Hereditário', '2018', 'hereditario.png', '4');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (5, 'Invocação do Mal', '2013', 'invocacao-do-mal.png', '4');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (6, 'Norbit', '2007', 'norbit.jpg', '2');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (7, 'Parasita', '2019', 'parasita.jpg', '3');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (8, 'Titanic', '1997', 'titanic.jpg', '5');
INSERT INTO FILME (id, nome, ano, capa, categoria_id) VALUES (9, 'Velozes e Furiosos 5', '2011', 'velozes-e-furiosos.jpg', '1');
-- Adicionar filmes para testar

-- PARA TESTAGEM, NÃO EXECUTE ATÉ AQUI!!!!
DROP TABLE USUARIO;
DROP TABLE FILME;
DROP TABLE FAVORITO;
DROP TABLE CATEGORIA;
ALTER TABLE FILME DROP FOREIGN KEY fk_categoria;
ALTER TABLE FAVORITO DROP FOREIGN KEY filme_id;
-- PARA TESTAGEM, NÃO EXECUTE ATÉ AQUI!!!!

-- Adicionar usuário como admin (apenas possível no sql)
UPDATE USUARIO SET role = 'admin' WHERE id = 1;