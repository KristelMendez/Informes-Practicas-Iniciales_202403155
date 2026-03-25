import React, { useState } from "react";
import axios from "axios";

function Recuperar() {
  const [registro, setRegistro] = useState(""); // El registro del usuario que quiere recuperar su contraseña
  const [correo, setCorreo] = useState(""); // El correo del usuario que quiere recuperar su contraseña
  const [nuevaContrasena, setNuevaContrasena] = useState(""); // La nueva contraseña que el usuario quiere establecer

  // Función para recuperar la contraseña
  const recuperar = async () => {
    try {
      // Enviamos una solicitud POST al backend para recuperar la contraseña del usuario
      await axios.post("http://localhost:3001/api/auth/recuperar", {
        registro,
        correo,
        nuevaContrasena,
      });

      alert("Contraseña actualizada");
      window.location.href = "/";

    } catch (err) {
      alert("Datos incorrectos");
    }
  };

  // Mostrar en pantalla el formulario para recuperar la contraseña
  return (
    <div style={{ padding: "20px" }}>
      <h2>Recuperar Contraseña</h2>

      <input placeholder="Registro" onChange={(e) => setRegistro(e.target.value)} />
      <br /><br />

      <input placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} />
      <br /><br />

      <input type="password" placeholder="Nueva contraseña" onChange={(e) => setNuevaContrasena(e.target.value)} />
      <br /><br />

      <button onClick={recuperar}>Actualizar</button>
    </div>
  );
}

export default Recuperar;