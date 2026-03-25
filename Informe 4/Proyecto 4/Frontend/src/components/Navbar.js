import React from "react";

// Componente de la barra de navegación
// Este componente se muestra en todas las páginas después de iniciar sesión
// Navbar quiere decir "barra de navegación" en inglés
function Navbar() {
  return (
    <div style={{
      backgroundColor: "#2c3e50",
      padding: "15px",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3>USAC - Ingeniería</h3>

      <div>
        <a href="/home" style={{ color: "white", margin: "10px" }}>Inicio</a>
        <a href="/crear" style={{ color: "white", margin: "10px" }}>Crear</a>
        <a href="/perfil" style={{ color: "white", margin: "10px" }}>Perfil</a>

        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;