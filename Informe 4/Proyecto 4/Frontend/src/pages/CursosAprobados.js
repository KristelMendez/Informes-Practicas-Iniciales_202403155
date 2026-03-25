import React, { useEffect, useState } from "react";
import axios from "axios";

// Página para mostrar los cursos aprobados por el usuario
function CursosAprobados() {
  const [cursos, setCursos] = useState([]); // Lista de cursos aprobados por el usuario
  const [listaCursos, setListaCursos] = useState([]); // Lista de todos los cursos para el select dinámico
  const [idCurso, setIdCurso] = useState(""); // El ID del curso que el usuario quiere agregar a su lista de cursos aprobados

  // Al cargar la página, obtenemos la lista de cursos aprobados por el usuario y la lista de todos los cursos para llenar el select
  // select dinámico quiere decir que el usuario puede elegir entre varias opciones que se muestran en un menú desplegable
  useEffect(() => {
    obtenerCursos();
    obtenerListaCursos();
  }, []);

  const obtenerCursos = async () => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.id;

    // Enviamos una solicitud GET al backend para obtener la lista de cursos aprobados por el usuario
    const res = await axios.get(`http://localhost:3001/api/cursos-aprobados/${id}`);
    setCursos(res.data);
  };

  // Función para obtener la lista de todos los cursos para llenar el select dinámico
  const obtenerListaCursos = async () => {
    const res = await axios.get("http://localhost:3001/api/cursos");
    setListaCursos(res.data);
  };

  // Función para agregar un curso aprobado al usuario
  const agregarCurso = async () => {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));

    // Enviamos una solicitud POST al backend para agregar el curso aprobado al usuario
    await axios.post("http://localhost:3001/api/cursos-aprobados", {
      id_usuario: payload.id,
      id_curso: idCurso
    });

    obtenerCursos();
  };

  // return es lo que se muestra en pantalla cuando el usuario visita esta página
  return (
    <div style={{ padding: "20px" }}>
      <h2>Cursos Aprobados</h2>

      <select onChange={(e) => setIdCurso(e.target.value)}>
        <option>Seleccione curso</option>
        {listaCursos.map((c) => (
          <option key={c.id_curso} value={c.id_curso}>
            {c.nombre_curso}
          </option>
        ))}
      </select>

      <button onClick={agregarCurso}>Agregar</button>

      <ul>
        {cursos.map((c, i) => (
          <li key={i}>
            {c.nombre_curso} - {c.creditos}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CursosAprobados;