// src/App.jsx
import React, { useState, useEffect } from "react";
import LoginRegisterPage from "./components/login/LoginRegisterPage";
import UtpListPage from "./components/utplist/UtpListPage";
import PerfilUsuario from "./components/utplist/PerfilUsuario";
import { getToken } from "./api/api";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null mientras se valida la sesión
  const [modoOscuro, setModoOscuro] = useState(false);

  useEffect(() => {
    const token = getToken();
    setIsLoggedIn(!!token);
  }, []);

  // Manejo global de modo oscuro
  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add("dark-mode");
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.setAttribute("data-bs-theme", "light");
    }
  }, [modoOscuro]);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleToggleTheme = () => setModoOscuro((prev) => !prev);

  if (isLoggedIn === null) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Ruta de login */}
          <Route 
            path="/login" 
            element={
              isLoggedIn ? <Navigate to="/" /> : <LoginRegisterPage onLogin={handleLogin} />
            }
          />

          {/* Rutas protegidas */}
          <Route 
            path="/" 
            element={
              isLoggedIn ? <UtpListPage onLogout={handleLogout} onToggleTheme={handleToggleTheme} /> : <Navigate to="/login" />
            }
          />
          <Route 
            path="/perfil" 
            element={
              isLoggedIn ? <PerfilUsuario onToggleTheme={handleToggleTheme} /> : <Navigate to="/login" />
            }
          />

          {/* Cualquier otra ruta redirige según autenticación */}
          <Route 
            path="*" 
            element={<Navigate to={isLoggedIn ? "/" : "/login"} />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
