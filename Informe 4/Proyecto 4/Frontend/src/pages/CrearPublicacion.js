import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// Página para crear una nueva publicación
function CrearPublicacion() {
  const [mensaje, setMensaje] = useState(""); // El mensaje que el usuario quiere publicar
  const [tipo, setTipo] = useState("curso"); // El tipo de publicación: "curso" o "catedratico"
  const [referenciaId, setReferenciaId] = useState(""); // El ID del curso o catedrático al que se refiere la publicación
  const [cursos, setCursos] = useState([]); // Lista de cursos para el select dinámico
  const [catedraticos, setCatedraticos] = useState([]); // Lista de catedráticos para el select dinámico

  // Al cargar la página, obtenemos la lista de cursos y catedráticos para llenar los selects
  useEffect(() => {
    axios.get("http://localhost:3001/api/cursos")
      .then(res => setCursos(res.data));

    axios.get("http://localhost:3001/api/catedraticos")
      .then(res => setCatedraticos(res.data));
  }, []);

  const crear = async () => {
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:3001/api/publicaciones",
      { tipo, referencia_id: referenciaId, mensaje },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Publicación creada");
  };

  // Renderizamos la página con el formulario para crear una publicación
  // renderizamos quiere decir "mostramos en pantalla"
  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h2>Crear Publicación</h2>

        <select onChange={(e) => setTipo(e.target.value)}>
          <option value="curso">Curso</option>
          <option value="catedratico">Catedrático</option>
        </select>

        <br /><br />

        {/* SELECT DINAMICO */}
        {tipo === "curso" ? (
          <select onChange={(e) => setReferenciaId(e.target.value)}>
            <option>Seleccione curso</option>
            {cursos.map(c => (
              <option value={c.id_curso}>
                {c.nombre_curso}
              </option>
            ))}
          </select>
        ) : (
          <select onChange={(e) => setReferenciaId(e.target.value)}> // Si el tipo es "catedratico", mostramos el select de catedráticos
            <option>Seleccione catedrático</option>
            {catedraticos.map(c => (
              <option value={c.id_catedratico}>
                {c.nombres} {c.apellidos}
              </option>
            ))}
          </select>
        )}

        <br /><br />

        <textarea placeholder="Mensaje"
          onChange={(e) => setMensaje(e.target.value)} />

        <br /><br />

        <button onClick={crear}>Publicar</button>
      </div>
    </div>
  );
}

export default CrearPublicacion;