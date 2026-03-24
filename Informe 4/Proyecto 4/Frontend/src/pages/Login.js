import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [registro, setRegistro] = useState("");
  const [contrasena, setContrasena] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        registro,
        contrasena,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login exitoso");
    } catch (err) {
      alert("Error en login");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Registro"
        onChange={(e) => setRegistro(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setContrasena(e.target.value)}
      />
      <br /><br />

      <button onClick={login}>Ingresar</button>
    </div>
  );
}

export default Login;