// src/components/utplist/EncabezadoPrincipal.jsx
import React from "react";

export default function EncabezadoPrincipal({ fechaActual, tareasPendientes }) {
  return (
    <div className="text-center mb-5">
      <h2 className="display-5 mb-3">Hoy</h2>
      <h3 className="h4 text-muted mb-3">{fechaActual}</h3>
      <p className="text-muted">
        {tareasPendientes === 0 
          ? "No tienes tareas pendientes 🎉" 
          : `Tienes ${tareasPendientes} ${tareasPendientes === 1 ? "tarea pendiente" : "tareas pendientes"}`
        }
      </p>
    </div>
  );
}
