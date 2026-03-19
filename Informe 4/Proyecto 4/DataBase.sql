CREATE DATABASE practica_web;
USE practica_web;

-- USUARIO
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    registro_academico VARCHAR(20) UNIQUE,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255)
);

-- CATEDRATICO
CREATE TABLE Catedratico (
    id_catedratico INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    correo VARCHAR(100)
);

-- CURSO
CREATE TABLE Curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre_curso VARCHAR(100),
    creditos INT,
    area VARCHAR(100)
);

-- PUBLICACION
CREATE TABLE Publicacion (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_curso INT NULL,
    id_catedratico INT NULL,
    mensaje TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES Curso(id_curso),
    FOREIGN KEY (id_catedratico) REFERENCES Catedratico(id_catedratico)
);

-- COMENTARIO
CREATE TABLE Comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_publicacion INT,
    id_usuario INT,
    mensaje TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_publicacion) REFERENCES Publicacion(id_publicacion),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- CURSOS APROBADOS
CREATE TABLE Curso_Aprobado (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_curso INT,
    fecha_aprobacion DATE,

    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
);

-- EJEMPLOS
INSERT INTO Curso (nombre_curso, creditos, area) VALUES
('Análisis y Diseño de Sistemas 1', 5, 'Sistemas'),
('Análisis y Diseño de Sistemas 2', 5, 'Sistemas'),
('Arquitectura de Computadoras y Ensambladores 1', 4, 'Sistemas'),
('Arquitectura de Computadoras y Ensambladores 2', 4, 'Sistemas'),
('Bases de Datos 1', 5, 'Sistemas'),
('Bases de Datos 2', 5, 'Sistemas'),
('Estructura de Datos', 5, 'Sistemas'),
('Inteligencia Artificial 1', 5, 'Sistemas'),
('Introducción a la Programación y Computación 1', 5, 'Sistemas'),
('Sistemas Operativos 1', 5, 'Sistemas');

INSERT INTO Catedratico (nombres, apellidos, correo) VALUES
('William Samuel', 'Guevara Orellana', 'wguevara@usac.edu.gt'),
('Edgar Francisco', 'Rodas Robledo', 'erodas@usac.edu.gt'),
('Claudia Liceth', 'Rojas Morales', 'crojas@usac.edu.gt'),
('Mirna Ivonne', 'Aldana Larrazabal', 'maldana@usac.edu.gt'),
('Otto Rene', 'Escobar Leiva', 'oescobar@usac.edu.gt'),
('Gabriel Alejandro', 'Díaz López', 'gdiaz@usac.edu.gt'),
('Luis Fernando', 'Espino Barrios', 'lespino@usac.edu.gt'),
('Luis Alberto', 'Arias', 'larias@usac.edu.gt'),
('Edgar Rene', 'Ornelis Hoil', 'eornelis@usac.edu.gt'),
('Sergio Arnaldo', 'Méndez Aguilar', 'smendez@usac.edu.gt');