import React, { useState } from "react";
import axios from "axios";

function CrearPublicacion() {
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("curso");
  const [referenciaId, setReferenciaId] = useState("");

  const crear = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/publicaciones",
        {
          tipo,
          referencia_id: referenciaId,
          mensaje,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Publicación creada");
    } catch (err) {
      console.log(err);
      alert("Error al crear publicación");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Crear Publicación</h2>

      <select onChange={(e) => setTipo(e.target.value)}>
        <option value="curso">Curso</option>
        <option value="catedratico">Catedrático</option>
      </select>

      <br /><br />

      <input
        placeholder="ID de referencia (curso o catedrático)"
        onChange={(e) => setReferenciaId(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Mensaje"
        onChange={(e) => setMensaje(e.target.value)}
      />

      <br /><br />

      <button onClick={crear}>Publicar</button>
    </div>
  );
}

export default CrearPublicacion;