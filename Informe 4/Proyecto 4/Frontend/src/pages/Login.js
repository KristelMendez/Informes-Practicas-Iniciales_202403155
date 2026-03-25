import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [registro, setRegistro] = useState(""); // El registro del usuario que quiere iniciar sesión
  const [contrasena, setContrasena] = useState(""); // La contraseña del usuario que quiere iniciar sesión

  // Función para iniciar sesión
  const login = async () => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/login", {
        registro,
        contrasena,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/home";

    } catch {
      alert("Error en login");
    }
  };

  // Mostrar en pantalla el formulario para iniciar sesión
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ecf0f1"
    }}>

      <div style={{
        display: "flex",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 2px 10px rgba(0,0,0,0.2)"
      }}>

        {/* TEXTO */}
        <div style={{ marginRight: "30px" }}>
          <h3>Facultad de Ingeniería</h3>
          <h4>Universidad de San Carlos de Guatemala</h4>
        </div>

        {/* FORM */}
        <div>
          <h2>Iniciar Sesión</h2>

          <input placeholder="Registro"
            onChange={(e) => setRegistro(e.target.value)} />

          <br /><br />

          <input type="password"
            placeholder="Contraseña"
            onChange={(e) => setContrasena(e.target.value)} />

          <br /><br />

          <button onClick={login}>Ingresar</button>

          <p style={{ marginTop: "10px" }}>
            <a href="/registro">Registrarse</a>
          </p>

          <p>
            <a href="/recuperar">¿Olvidó contraseña?</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;