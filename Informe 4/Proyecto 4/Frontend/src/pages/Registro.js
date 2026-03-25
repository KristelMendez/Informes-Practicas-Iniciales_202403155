import React, { useState } from "react";
import axios from "axios";

function Registro() {
  const [registro, setRegistro] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const registrar = async () => {
    try {
      // Enviamos una solicitud POST al backend para registrar un nuevo usuario
      await axios.post("http://localhost:3001/api/auth/registro", {
        registro,
        nombres,
        apellidos,
        correo,
        contrasena,
      });

      alert("Usuario registrado");
    } catch (err) {
      alert("Error al registrar");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Registro</h2>

      <input placeholder="Registro" onChange={(e) => setRegistro(e.target.value)} />
      <br /><br />

      <input placeholder="Nombres" onChange={(e) => setNombres(e.target.value)} />
      <br /><br />

      <input placeholder="Apellidos" onChange={(e) => setApellidos(e.target.value)} />
      <br /><br />

      <input placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Contraseña" onChange={(e) => setContrasena(e.target.value)} />
      <br /><br />

      <button onClick={registrar}>Registrarse</button>
    </div>
  );
}

export default Registro;