import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Home() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerPublicaciones();
  }, []);

  const obtenerPublicaciones = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3001/api/publicaciones", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPublicaciones(res.data);
    } catch (err) {
      console.log(err);
      alert("Error al obtener publicaciones");
    }
  };

  const cargarComentarios = async (id) => {
    const res = await axios.get(`http://localhost:3001/api/comentarios/${id}`);

    setComentarios({
      ...comentarios,
      [id]: res.data,
    });
  };

  const crearComentario = async (id_publicacion) => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));

      await axios.post("http://localhost:3001/api/comentarios", {
        id_publicacion,
        id_usuario: payload.id,
        mensaje: nuevoComentario,
      });

      alert("Comentario agregado");
      setNuevoComentario("");

      cargarComentarios(id_publicacion);

    } catch (err) {
      console.log(err);
      alert("Error al comentar");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h2>Publicaciones</h2>

      {/* BUSCADOR */}
      <input
        placeholder="Buscar publicaciones..."
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {publicaciones
        .filter((p) =>
          p.mensaje.toLowerCase().includes(busqueda.toLowerCase())
        )
        .map((p) => (
          <div key={p.id_publicacion} style={{
            backgroundColor: "white",
            borderRadius: "10px",
            margin: "15px 0",
            padding: "15px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
          }}>

            <p><strong>{p.nombres} {p.apellidos}</strong></p>
            <p>{p.mensaje}</p>
            <p style={{ fontSize: "12px", color: "gray" }}>
              {new Date(p.fecha).toLocaleString()}
            </p>

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
              placeholder="Escribe un comentario"
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