import React, { useEffect, useState } from "react";
import axios from "axios";

function CursosAprobados() {
  const [cursos, setCursos] = useState([]);
  const [idCurso, setIdCurso] = useState("");

  useEffect(() => {
    obtenerCursos();
  }, []);

  const obtenerCursos = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.id;

      const res = await axios.get(`http://localhost:3001/api/cursos-aprobados/${id}`);

      setCursos(res.data);

    } catch (err) {
      console.log(err);
      alert("Error al obtener cursos");
    }
  };

  const agregarCurso = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const id_usuario = payload.id;

      await axios.post("http://localhost:3001/api/cursos-aprobados", {
        id_usuario,
        id_curso: parseInt(idCurso)
      });

      alert("Curso agregado");

      obtenerCursos();

    } catch (err) {
      console.log(err);
      alert("Error al agregar curso");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cursos Aprobados</h2>

      <input
        placeholder="ID"
        onChange={(e) => setIdCurso(e.target.value)}
      />

      <button onClick={agregarCurso}>Agregar</button>

      <ul>
        {cursos.map((c, i) => (
          <li key={i}>
            {c.nombre_curso} - {c.creditos} créditos
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CursosAprobados;