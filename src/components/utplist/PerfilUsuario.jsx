import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../../api/api";
import NavbarSuperior from "./NavbarSuperior";

export default function PerfilUsuario({ onToggleTheme }) {
  // Estados para los campos del usuario
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: ""
  });
  const [loading, setLoading] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    // Detecta el modo actual leyendo el atributo del body
    const updateMode = () => {
      const isDark = document.body.classList.contains("dark-mode") || document.body.getAttribute("data-bs-theme") === "dark";
      setModoOscuro(isDark);
    };
    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-bs-theme"] });
    return () => observer.disconnect();
  }, []);

  // Cargar datos actuales del usuario (puedes mejorar esto con un useEffect si tienes endpoint de usuario actual)
  // useEffect(() => { ... }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí deberías tener el endpoint correcto para actualizar el usuario
      await api.put("/usuarios/perfil", form);
      Swal.fire("¡Éxito!", "Perfil actualizado correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el perfil.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavbarSuperior onToggleTheme={onToggleTheme} />
      <div
        className={`container mt-5 p-4 d-flex flex-column align-items-center justify-content-center ${modoOscuro ? "text-light" : "text-dark"}`}
        style={{ maxWidth: 500, borderRadius: 12, background: modoOscuro ? '#181818' : '#fff', boxShadow: modoOscuro ? 'none' : '0 2px 12px rgba(0,0,0,0.04)' }}
      >
        <h2 className="mb-4 w-100 text-center">Editar Perfil</h2>
        <form
          onSubmit={handleSubmit}
          className="w-100"
          style={{
            background: modoOscuro ? "#181818" : "#fff",
            borderRadius: 8,
            padding: 24,
            boxShadow: 'none'
          }}
        >
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${modoOscuro ? "border-0" : ""}`}
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={modoOscuro ? { background: "#232323", color: "#fff", height: 50, fontSize: 20 } : { height: 50, fontSize: 20 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className={`form-control ${modoOscuro ? "border-0" : ""}`}
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              style={modoOscuro ? { background: "#232323", color: "#fff", height: 50, fontSize: 20 } : { height: 50, fontSize: 20 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className={`form-control ${modoOscuro ? "border-0" : ""}`}
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              style={modoOscuro ? { background: "#232323", color: "#fff", height: 50, fontSize: 20 } : { height: 50, fontSize: 20 }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className={`form-control ${modoOscuro ? "border-0" : ""}`}
              name="contrasena"
              value={form.contrasena}
              onChange={handleChange}
              minLength={6}
              placeholder="Nueva contraseña (opcional)"
              style={modoOscuro ? { background: "#232323", color: "#fff", height: 50, fontSize: 20 } : { height: 50, fontSize: 20 }}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      </div>
    </>
  );
} 