const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// CONEXIÓN A MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Krootm2",
    database: "practica_web"
});

// probar conexión
db.connect(err => {
    if (err) {
        console.log("Error conexión:", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

// ENDPOINT DE PRUEBA
app.get("/", (req, res) => {
    res.send("Backend funcionando correctamente");
});

// REGISTRO
app.post("/api/auth/registro", async (req, res) => {
    const { registro, nombres, apellidos, correo, contrasena } = req.body;

    const hash = await bcrypt.hash(contrasena, 10);

    const sql = `
        INSERT INTO Usuario (registro_academico, nombres, apellidos, correo, contrasena)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [registro, nombres, apellidos, correo, hash], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ mensaje: "Usuario registrado" });
    });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
    const { registro, contrasena } = req.body;

    const sql = `SELECT * FROM Usuario WHERE registro_academico = ?`;

    db.query(sql, [registro], async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(400).json({ mensaje: "Usuario no existe" });
        }

        const user = results[0];

        const valido = await bcrypt.compare(contrasena, user.contrasena);

        if (!valido) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.id_usuario },
            "secreto",
            { expiresIn: "1h" }
        );

        res.json({ token });
    });
});

// OBTENER CURSOS
app.get("/api/cursos", (req, res) => {
    const sql = "SELECT * FROM Curso";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// OBTENER CATEDRATICOS
app.get("/api/catedraticos", (req, res) => {
    const sql = "SELECT * FROM Catedratico";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error al obtener catedráticos" });
        }
        res.json(results);
    });
});

// CREAR PUBLICACIÓN
app.post("/api/publicaciones", (req, res) => {
    const { id_usuario, id_curso, id_catedratico, mensaje } = req.body;

    const sql = `
        INSERT INTO Publicacion (id_usuario, id_curso, id_catedratico, mensaje)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [id_usuario, id_curso, id_catedratico, mensaje], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ mensaje: "Publicación creada" });
    });
});

// VER PUBLICACIONES
app.get("/api/publicaciones", (req, res) => {
    const sql = `
        SELECT p.*, u.nombres, u.apellidos
        FROM Publicacion p
        JOIN Usuario u ON p.id_usuario = u.id_usuario
        ORDER BY p.fecha DESC
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

// CREAR COMENTARIO
app.post("/api/comentarios", (req, res) => {
    const { id_publicacion, id_usuario, mensaje } = req.body;

    const sql = `
        INSERT INTO Comentario (id_publicacion, id_usuario, mensaje)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [id_publicacion, id_usuario, mensaje], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ mensaje: "Comentario agregado" });
    });
});

// VER COMENTARIOS
app.get("/api/comentarios/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT c.*, u.nombres
        FROM Comentario c
        JOIN Usuario u ON c.id_usuario = u.id_usuario
        WHERE c.id_publicacion = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

// OBTENER USUARIO POR ID
app.get("/api/usuario/:id", (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM Usuario WHERE id_usuario = ?";

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results[0]);
    });
});

// AGREGAR CURSO APROBADO
app.post("/api/cursos-aprobados", (req, res) => {
    const { id_usuario, id_curso } = req.body;

    const sql = `
        INSERT INTO Curso_Aprobado (id_usuario, id_curso, fecha_aprobacion)
        VALUES (?, ?, NOW())
    `;

    db.query(sql, [id_usuario, id_curso], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ mensaje: "Curso agregado" });
    });
});

// VER CURSOS APROBADOS
app.get("/api/cursos-aprobados/:id", (req, res) => {
    const id = req.params.id;

    const sql = `
        SELECT c.nombre_curso, c.creditos
        FROM Curso_Aprobado ca
        JOIN Curso c ON ca.id_curso = c.id_curso
        WHERE ca.id_usuario = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

// INICIAR SERVIDOR
app.listen(3001, () => {
    console.log("Servidor en http://localhost:3001");
});
