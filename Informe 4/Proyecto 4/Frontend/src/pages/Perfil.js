import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// Página de perfil del usuario
function Perfil() {
  const [usuario, setUsuario] = useState(null); // Información del usuario que se muestra en el perfil
  const [cursos, setCursos] = useState([]); // Cursos 
  const [cursosDisponibles, setCursosDisponibles] = useState([]); // Lista de cursos disponibles 
  const [usuarioEdicion, setUsuarioEdicion] = useState(null); // Información del usuario en modo de edición
  const [editando, setEditando] = useState(false); // editando info o no
  const [registroBusqueda, setRegistroBusqueda] = useState(""); // El número de registro para buscar
  const [usuarioBuscado, setUsuarioBuscado] = useState(null); // Información del usuario al buscar
  const [cursosBuscado, setCursosBuscado] = useState([]); // Cursos aprobados al buscar un usuario
  const [buscando, setBuscando] = useState(false); // Indica si se está realizando una búsqueda
  const [mensajeError, setMensajeError] = useState(""); // Mensaje de error al buscar un usuario o al editar la info
  const [cursoSeleccionado, setCursoSeleccionado] = useState(""); // El ID para agregar a su lista de cursos aprobados
  const [agregandoCurso, setAgregandoCurso] = useState(false); // Indica si se está agregando un curso

  // obtener info 
  useEffect(() => { 
    obtenerPerfil();
    cargarCursosDisponibles();
  }, []);

  // Función para cargar la lista de cursos disponibles para agregar a la lista de cursos aprobados
  const cargarCursosDisponibles = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/cursos"); // Traemos la lista de todos los cursos disponibles
      setCursosDisponibles(res.data);
    } catch (err) {
      console.log("Error al cargar cursos:", err);
    }
  };

  const obtenerPerfil = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.id;

      // traer usuario
      const res = await axios.get(`http://localhost:3001/api/usuario/${id}`);
      setUsuario(res.data);
      setUsuarioEdicion({ ...res.data });

      // traer cursos aprobados
      const cursosRes = await axios.get(`http://localhost:3001/api/cursos-aprobados/${id}`);
      setCursos(cursosRes.data);

    } catch (err) {
      console.log(err);
      alert("Error al obtener perfil");
    }
  };

  // Función para editar la información del usuario
  const handleEditarUsuario = async () => {
    try {
      await axios.put(`http://localhost:3001/api/usuario/${usuario.id_usuario}`, {
        nombres: usuarioEdicion.nombres,
        apellidos: usuarioEdicion.apellidos,
        correo: usuarioEdicion.correo,
      });
      setUsuario(usuarioEdicion);
      setEditando(false);
      alert("Información actualizada correctamente");
    } catch (err) {
      console.log("Error completo:", err);
      const mensajeError = err.response?.data?.mensaje || err.response?.data?.error || err.message || "Error al actualizar información";
      alert(`Error: ${mensajeError}`);
    }
  };

  // Función para buscar un usuario por su registro académico
  const handleBuscarUsuario = async () => {
    try {
      setMensajeError("");
      setBuscando(true);
      
      // Buscar usuario por registro académico
      const res = await axios.get(
        `http://localhost:3001/api/usuario-por-registro/${registroBusqueda}`
      );
      setUsuarioBuscado(res.data);

      // Traer cursos aprobados del usuario buscado
      const cursosRes = await axios.get(
        `http://localhost:3001/api/cursos-aprobados/${res.data.id_usuario}`
      );
      setCursosBuscado(cursosRes.data);
      
    } catch (err) {
      console.log("Error al buscar:", err);
      const mensajeError = err.response?.data?.error || err.message || "Usuario no encontrado";
      setMensajeError(mensajeError);
      setUsuarioBuscado(null);
      setCursosBuscado([]);
    } finally {
      setBuscando(false);
    }
  };

  // Función para limpiar la búsqueda y volver al estado inicial
  const limpiarBusqueda = () => {
    setRegistroBusqueda("");
    setUsuarioBuscado(null);
    setCursosBuscado([]);
    setMensajeError("");
  };

  const handleAgregarCurso = async () => {
    try {
      if (!cursoSeleccionado) {
        alert("Por favor selecciona un curso");
        return;
      }

      setAgregandoCurso(true);

      // Verificar si el curso ya está agregado
      const cursoYaAgregado = cursos.some(c => c.id_curso === parseInt(cursoSeleccionado));
      if (cursoYaAgregado) {
        alert("Este curso ya está en tu lista de aprobados");
        setAgregandoCurso(false);
        return;
      }

      await axios.post("http://localhost:3001/api/cursos-aprobados", {
        id_usuario: usuario.id_usuario,
        id_curso: parseInt(cursoSeleccionado),
      });

      // Recargar los cursos
      const cursosRes = await axios.get(
        `http://localhost:3001/api/cursos-aprobados/${usuario.id_usuario}`
      );
      setCursos(cursosRes.data);
      setCursoSeleccionado("");

      alert("Curso agregado correctamente");
    } catch (err) {
      console.log("Error al agregar curso:", err);
      alert("Error al agregar curso");
    } finally {
      setAgregandoCurso(false);
    }
  };

  if (!usuario) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />

      <div style={{ maxWidth: "900px", margin: "auto" }}>

        {/* MI PERFIL */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h2>Mi Perfil</h2>

          {!editando ? (
            <>
              <p><strong>Registro:</strong> {usuario.registro_academico}</p>
              <p><strong>Nombre:</strong> {usuario.nombres} {usuario.apellidos}</p>
              <p><strong>Correo:</strong> {usuario.correo}</p>

              <button
                onClick={() => setEditando(true)}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "15px"
                }}
              >
                Editar Información
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label><strong>Registro:</strong> {usuario.registro_academico} </label>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label><strong>Nombres:</strong></label>
                <input
                  type="text"
                  value={usuarioEdicion.nombres}
                  onChange={(e) => setUsuarioEdicion({ ...usuarioEdicion, nombres: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ddd"
                  }}
                />
              </div>

              <div style={{ marginBottom: "10px" }}>
                <label><strong>Apellidos:</strong></label>
                <input
                  type="text"
                  value={usuarioEdicion.apellidos}
                  onChange={(e) => setUsuarioEdicion({ ...usuarioEdicion, apellidos: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ddd"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label><strong>Correo:</strong></label>
                <input
                  type="email"
                  value={usuarioEdicion.correo}
                  onChange={(e) => setUsuarioEdicion({ ...usuarioEdicion, correo: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ddd"
                  }}
                />
              </div>

              <div>
                <button
                  onClick={handleEditarUsuario}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px"
                  }}
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditando(false);
                    setUsuarioEdicion({ ...usuario });
                  }}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </>
          )}

          {/* CURSOS APROBADOS */}
          <h3 style={{ marginTop: "20px" }}>Mis Cursos Aprobados</h3>

          {/* AGREGAR CURSOS */}
          <div style={{ 
            backgroundColor: "#f9f9f9", 
            padding: "15px", 
            borderRadius: "5px", 
            marginBottom: "20px",
            border: "1px solid #ddd"
          }}>
            <h4>Agregar Curso Aprobado</h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label><strong>Selecciona un curso:</strong></label>
                <select
                  value={cursoSeleccionado}
                  onChange={(e) => setCursoSeleccionado(e.target.value)}
                  style={{
                    width: "100%", // Ocupa todo el ancho del contenedor
                    padding: "10px",
                    marginTop: "5px",
                    borderRadius: "5px",
                    border: "1px solid #ddd"
                  }}
                >
                  <option value="">Seleccionar</option>
                  {cursosDisponibles.map((c) => (
                    <option key={c.id_curso} value={c.id_curso}>
                      {c.nombre_curso} ({c.creditos} créditos)
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleAgregarCurso}
                disabled={agregandoCurso || !cursoSeleccionado}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: agregandoCurso ? "not-allowed" : "pointer",
                  opacity: agregandoCurso || !cursoSeleccionado ? 0.6 : 1
                }}
              >
                {agregandoCurso ? "Agregando..." : "+ Agregar"}
              </button>
            </div>
          </div>

          {/* LISTA DE CURSOS */}
          {cursos.length === 0 ? (
            <p style={{ color: "#999" }}>No hay cursos aún</p>
          ) : (
            <>
              <div style={{
                backgroundColor: "#f0f7ff",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #2196F3"
              }}>
                {cursos.map((c, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: "10px", 
                      backgroundColor: "#ffffff", 
                      marginBottom: "8px", 
                      borderRadius: "5px",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <p style={{ margin: 0 }}><strong>{c.nombre_curso}</strong></p>
                    <span style={{ 
                      backgroundColor: "#E3F2FD",  // Un fondo azul claro para resaltar los créditos
                      padding: "5px 10px", 
                      borderRadius: "20px",
                      fontSize: "12px",
                      color: "#1976D2"
                    }}>
                      {c.creditos} créditos
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* BUSCAR OTROS USUARIOS */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h2>Buscar Perfil de Otro Usuario</h2>

          <div style={{ marginBottom: "15px" }}>
            <label><strong>Ingrese número de registro académico:</strong></label>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input
                type="text"
                value={registroBusqueda}
                onChange={(e) => setRegistroBusqueda(e.target.value)}
                placeholder="Ej: 202203155"
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ddd"
                }}
              />
              <button
                onClick={handleBuscarUsuario}
                disabled={buscando || !registroBusqueda.trim()}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: buscando ? "not-allowed" : "pointer",
                  opacity: buscando || !registroBusqueda.trim() ? 0.6 : 1
                }}
              >
                {buscando ? "Buscando..." : "Buscar"}
              </button>
              {usuarioBuscado && (
                <button
                  onClick={limpiarBusqueda}
                  style={{
                    backgroundColor: "#757575",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {mensajeError && (
            <div style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px"
            }}>
              {mensajeError}
            </div>
          )}

          {usuarioBuscado && (
            <div style={{
              backgroundColor: "#f0f7ff",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "20px",
              border: "2px solid #2196F3"
            }}>
              <h3>Información del Usuario</h3>

              <p><strong>Registro:</strong> {usuarioBuscado.registro_academico}</p>
              <p><strong>Nombre:</strong> {usuarioBuscado.nombres} {usuarioBuscado.apellidos}</p>
              <p><strong>Correo:</strong> {usuarioBuscado.correo}</p>

              <h4>Cursos Aprobados</h4>

              {cursosBuscado.length === 0 ? (
                <p>Este usuario no tiene cursos aprobados</p>
              ) : (
                cursosBuscado.map((c, i) => (
                  <div key={i} style={{ padding: "8px", backgroundColor: "#ffffff", marginBottom: "5px", borderRadius: "5px", border: "1px solid #e0e0e0" }}>
                    <p>{c.nombre_curso} - {c.creditos} créditos</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;