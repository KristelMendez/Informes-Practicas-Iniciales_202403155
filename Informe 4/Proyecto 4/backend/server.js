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

// INICIAR SERVIDOR
app.listen(3001, () => {
    console.log("Servidor en http://localhost:3001");
});
