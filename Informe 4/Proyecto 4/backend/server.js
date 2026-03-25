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

app.post("/api/auth/recuperar", async (req, res) => {
    const { registro, correo, nuevaContrasena } = req.body;

    const sql = "SELECT * FROM Usuario WHERE registro_academico = ? AND correo = ?";

    db.query(sql, [registro, correo], async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(400).json({ mensaje: "Datos incorrectos" });
        }

        const hash = await bcrypt.hash(nuevaContrasena, 10);

        const updateSql = "UPDATE Usuario SET contrasena = ? WHERE registro_academico = ?";

        db.query(updateSql, [hash, registro], (err2) => {
            if (err2) return res.status(500).json(err2);

            res.json({ mensaje: "Contraseña actualizada" });
        });
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
    try {
        const { tipo, referencia_id, mensaje } = req.body;

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "No hay token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, "secreto");

        let id_curso = null;
        let id_catedratico = null;

        if (tipo === "curso") {
            id_curso = referencia_id;
        } else if (tipo === "catedratico") {
            id_catedratico = referencia_id;
        }

        const sql = `
            INSERT INTO Publicacion (id_usuario, id_curso, id_catedratico, mensaje)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            sql,
            [decoded.id, id_curso, id_catedratico, mensaje],
            (err, result) => {
                if (err) {
                    console.log(err); 
                    return res.status(500).json(err);
                }

                res.json({ mensaje: "Publicación creada correctamente" });
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error en servidor" });
    }
});

// VER PUBLICACIONES
// VER PUBLICACIONES (CORREGIDO)
app.get("/api/publicaciones", (req, res) => {
    const sql = `
        SELECT p.*, u.nombres, u.apellidos,
        c.nombre_curso,
        CONCAT(cat.nombres, ' ', cat.apellidos) AS nombre_catedratico
        FROM Publicacion p
        JOIN Usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN Curso c ON p.id_curso = c.id_curso
        LEFT JOIN Catedratico cat ON p.id_catedratico = cat.id_catedratico
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

// OBTENER USUARIO POR REGISTRO ACADÉMICO
app.get("/api/usuario-por-registro/:registro", (req, res) => {
    const registro = req.params.registro;

    const sql = "SELECT id_usuario, registro_academico, nombres, apellidos, correo FROM Usuario WHERE registro_academico = ?";

    db.query(sql, [registro], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(results[0]);
    });
});

// ACTUALIZAR INFORMACIÓN DE USUARIO
app.put("/api/usuario/:id", (req, res) => {
    const id = req.params.id;
    const { nombres, apellidos, correo } = req.body;

    const sql = "UPDATE Usuario SET nombres = ?, apellidos = ?, correo = ? WHERE id_usuario = ?";

    db.query(sql, [nombres, apellidos, correo, id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({ mensaje: "Usuario actualizado correctamente" });
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
