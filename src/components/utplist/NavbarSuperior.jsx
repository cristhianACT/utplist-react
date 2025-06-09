// src/components/utplist/NavbarSuperior.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NavbarSuperior({ onToggleTheme, onCleanCompleted, onLogout, onFiltroChange }) {
  const handleSelectChange = (e) => {
    onFiltroChange(e.target.value);
  };
  const navigate = useNavigate();

  // Detectar modo oscuro/claro para el icono
  const [modoOscuro, setModoOscuro] = useState(false);
  useEffect(() => {
    const updateMode = () => {
      const isDark = document.body.classList.contains("dark-mode") || document.body.getAttribute("data-bs-theme") === "dark";
      setModoOscuro(isDark);
    };
    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-bs-theme"] });
    // --- Script para toggle hamburguesa ---
    const btnHamburguesa = document.querySelector('.navbar-toggler');
    const navCollapse = document.getElementById('navContent');
    if (btnHamburguesa && navCollapse) {
      btnHamburguesa.addEventListener('click', () => {
        if (navCollapse.classList.contains('show')) {
          // Si está abierto, ciérralo
          navCollapse.classList.remove('show');
        } else {
          // Si está cerrado, ábrelo
          navCollapse.classList.add('show');
        }
      });
    }
    return () => {
      observer.disconnect();
      if (btnHamburguesa && navCollapse) {
        btnHamburguesa.onclick = null;
      }
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-md bg-white shadow-sm mb-4">
      <div className="container-fluid">
        <button className="navbar-brand btn p-0 border-0 bg-transparent" onClick={() => navigate("/") } style={{cursor: 'pointer'}}>
          <img src="/logo.png" width="100" alt="Logo" />
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
          aria-controls="navContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item">
              <button
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalAgregarTarea"
                style={{marginBottom: '0.5rem'}}
              >
                <i className="bi bi-calendar-plus me-1"></i> Agregar
              </button>
            </li>
            <li className="nav-item">
              <select
                id="filtroTareas"
                className="form-select"
                style={{ width: "180px" }}
                onChange={handleSelectChange}
              >
                <option value="todas">Todas</option>
                <option value="hoy">Hoy</option>
                <option value="en_proceso">En proceso</option>
                <option value="completado">Completadas</option>
              </select>
            </li>
            <li className="nav-item">
              <button
                onClick={onToggleTheme}
                className="btn btn-outline-secondary rounded-circle"
                style={{ width: "40px", height: "40px" }}
                type="button"
              >
                {modoOscuro ? (
                  <i className="bi bi-sun-fill"></i>
                ) : (
                  <i className="bi bi-moon-fill"></i>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button id="btn-clean" onClick={onCleanCompleted} className="btn btn-outline-secondary" type="button">
                <i className="bi bi-trash3 me-1"></i>Limpiar completadas
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-primary" onClick={() => navigate("/perfil") }>
                <i className="bi bi-person-circle me-1"></i> Perfil
              </button>
            </li>
            <li className="nav-item">
              <button id="btn-logout" onClick={onLogout} className="btn btn-outline-danger" type="button">
                <i className="bi bi-box-arrow-right me-1"></i>Salir
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
