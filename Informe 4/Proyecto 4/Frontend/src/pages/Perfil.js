import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    obtenerPerfil();
  }, []);

  const obtenerPerfil = async () => {
    try {
      const token = localStorage.getItem("token");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.id;

      // traer usuario
      const res = await axios.get(`http://localhost:3001/api/usuario/${id}`);
      setUsuario(res.data);

      // traer cursos aprobados
      const cursosRes = await axios.get(`http://localhost:3001/api/cursos-aprobados/${id}`);
      setCursos(cursosRes.data);

    } catch (err) {
      console.log(err);
      alert("Error al obtener perfil");
    }
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
        margin: "auto",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h2>Perfil</h2>

        <p><strong>Registro:</strong> {usuario.registro_academico}</p>
        <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>

        {/*CURSOS APROBADOS */}
        <h3>Cursos Aprobados</h3>

        {cursos.length === 0 ? (
          <p>No hay cursos aún</p>
        ) : (
          cursos.map((c, i) => (
            <div key={i}>
              <p>{c.nombre_curso} - {c.creditos} créditos</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Perfil;