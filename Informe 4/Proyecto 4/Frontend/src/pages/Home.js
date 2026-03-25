import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// Home es la página principal que se muestra después de iniciar sesión
function Home() {
  const [publicaciones, setPublicaciones] = useState([]); // Lista de publicaciones que se muestran en el home
  const [comentarios, setComentarios] = useState({}); // Comentarios de cada publicación, guardados en un objeto donde la clave es el ID de la publicación
  const [nuevoComentario, setNuevoComentario] = useState(""); // El mensaje del nuevo comentario que el usuario quiere agregar
  const [filtro, setFiltro] = useState("todos"); // El filtro para mostrar publicaciones

  // Al cargar la página, obtenemos la lista de publicaciones para mostrar en el home
  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  // Función para obtener la lista de publicaciones desde el backend
  const obtenerPublicaciones = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3001/api/publicaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPublicaciones(res.data);
    } catch (err) {
      console.log(err);
      alert("Error al obtener publicaciones");
    }
  };

  // Función para cargar los comentarios de una publicación específica
  const cargarComentarios = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/comentarios/${id}`);
    setComentarios({ ...comentarios, [id]: res.data });
  };

  // Función para crear un nuevo comentario
  const crearComentario = async (id_publicacion) => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      await axios.post("http://localhost:3001/api/comentarios", {
        id_publicacion,
        id_usuario: payload.id,
        mensaje: nuevoComentario,
      });

      setNuevoComentario("");
      cargarComentarios(id_publicacion);

    } catch (err) {
      console.log(err);
      alert("Error al comentar");
    }
  };

  // Mostrar en pantalla la página con el formulario para crear una publicación
  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h2>Publicaciones</h2>

      {/* FILTRO */}
      <select onChange={(e) => setFiltro(e.target.value)}>
        <option value="todos">Todas</option>
        <option value="curso">Cursos</option>
        <option value="catedratico">Catedráticos</option>
      </select>

      {publicaciones
        .filter((p) => {
          if (filtro === "todos") return true;
          if (filtro === "curso") return p.id_curso !== null;
          if (filtro === "catedratico") return p.id_catedratico !== null;
        })
        .map((p) => (
          <div key={p.id_publicacion} style={{
            backgroundColor: "white",
            borderRadius: "10px",
            margin: "15px 0",
            padding: "15px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
          }}>

            <p><strong>{p.nombres} {p.apellidos}</strong></p>

            {/* TIPO */}
            <p style={{ color: "blue" }}>
              {p.id_curso ? "Curso" : "Catedrático"}
            </p>

            {/* NOMBRE */}
            <p>
              {p.nombre_curso || `${p.nombre_catedratico || ""}`}
            </p>

            <p>{p.mensaje}</p>

            <button onClick={() => cargarComentarios(p.id_publicacion)}>
              Ver comentarios
            </button>

            <ul>
              {comentarios[p.id_publicacion]?.map((c) => (
                <li key={c.id_comentario}>
                  {c.nombres}: {c.mensaje}
                </li>
              ))}
            </ul>

            <input
              placeholder="Comentario"
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
            />

            <button onClick={() => crearComentario(p.id_publicacion)}>
              Comentar
            </button>

          </div>
        ))}
    </div>
  );
}

export default Home;