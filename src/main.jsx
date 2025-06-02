// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// --- ESTILOS ---
// 1. Bootstrap CSS: Base para los estilos de toda la app.
import "bootstrap/dist/css/bootstrap.min.css";

// 2. Bootstrap Icons CSS.
import "bootstrap-icons/font/bootstrap-icons.css";

// 3. SweetAlert2 CSS: Para los mensajes de alerta.
import "sweetalert2/dist/sweetalert2.min.css";

// 4. CSS personalizado de utplist: Importa los estilos originales.
// main.jsx
import "../src/components/utplist/CSS/estilo.CSS";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
