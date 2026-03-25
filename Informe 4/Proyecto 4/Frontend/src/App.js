import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importamos las páginas que se mostrarán en la aplicación
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Home from "./pages/Home";
import CrearPublicacion from "./pages/CrearPublicacion";
import Perfil from "./pages/Perfil";
import Recuperar from "./pages/Recuperar";

// Componente principal de la aplicación que define las rutas para cada página
function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<Home />} />
        <Route path="/crear" element={<CrearPublicacion />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/recuperar" element={<Recuperar />} />

      </Routes>
    </Router>
  );
}

export default App;