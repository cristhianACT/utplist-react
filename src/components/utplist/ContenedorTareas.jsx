import React from "react";
import TarjetaTarea from "./TarjetaTarea";

export default function ContenedorTareas({ tareas, onCambiarEstado, onEditar }) {
  if (!tareas || tareas.length === 0) {
    return (
      <div className="text-center text-muted my-5">
        <p className="h5">No hay tareas para mostrar.</p>
      </div>
    );
  }

  // Si solo hay una tarea, centrada vertical y horizontalmente
  if (tareas.length === 1) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '30vh', width: '100%' }}>
        <div style={{ width: '100%', maxWidth: 600 }}>
          <TarjetaTarea
            key={tareas[0].id}
            tarea={tareas[0]}
            onCambiarEstado={onCambiarEstado}
            onEditar={onEditar}
          />
        </div>
      </div>
    );
  }

  // Si hay más de una tarea, usar grid de hasta 3 columnas
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${tareas.length < 3 ? tareas.length : 3}, 1fr)` ,
      gap: '2rem',
      justifyContent: 'center',
      alignItems: 'flex-start',
      maxWidth: 1900,
      margin: '0 auto',
    }}>
      {tareas.map((tarea) => (
        <TarjetaTarea
          key={tarea.id}
          tarea={tarea}
          onCambiarEstado={onCambiarEstado}
          onEditar={onEditar}
        />
      ))}
    </div>
  );
}
