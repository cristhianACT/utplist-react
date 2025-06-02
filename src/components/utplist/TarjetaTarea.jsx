import React from "react";

export default function TarjetaTarea({ tarea, onCambiarEstado, onEditar }) {
  const { id, nombre, categoria, descripcion, fecha, estado } = tarea;

  // Badge de estado
  const estadoBadge = {
    COMPLETADO: { className: "bg-success text-white", text: "Completado" },
    EN_PROCESO: { className: "bg-primary text-white", text: "En Proceso" },
    PENDIENTE: { className: "bg-secondary text-white", text: "Pendiente" }
  }[estado] || { className: "bg-secondary text-white", text: "Pendiente" };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <div className="card-title">{nombre}</div>
            <div className="text-muted text-uppercase small">{categoria}</div>
          </div>
          <span className={`badge ${estadoBadge.className}`}>{estadoBadge.text}</span>
        </div>
        
        <hr className="my-3" />
        
        {descripcion && <div className="card-text mb-3">{descripcion}</div>}
        
        <div className="text-muted small mb-4">
          <i className="bi bi-calendar3 me-2"></i>
          {fecha}
        </div>

        <div className="mt-auto">
          <div className="button-group d-flex flex-row gap-2 mb-3">
            <button
              className={`btn btn-outline-secondary${estado === "PENDIENTE" ? " active" : ""}`}
              onClick={() => onCambiarEstado(id, "PENDIENTE")}
            >
              <i className="bi bi-pause-fill me-2"></i>
              <span>Pendiente</span>
            </button>
            <button
              className={`btn btn-outline-primary${estado === "EN_PROCESO" ? " active" : ""}`}
              onClick={() => onCambiarEstado(id, "EN_PROCESO")}
            >
              <i className="bi bi-play-fill me-2"></i>
              <span>En Proceso</span>
            </button>
            <button
              className={`btn btn-outline-success${estado === "COMPLETADO" ? " active" : ""}`}
              onClick={() => onCambiarEstado(id, "COMPLETADO")}
            >
              <i className="bi bi-check2 me-2"></i>
              <span>Completado</span>
            </button>
          </div>
          
          <button
            className="btn btn-warning w-100 d-flex align-items-center justify-content-center"
            onClick={() => onEditar(id)}
          >
            <i className="bi bi-pencil-fill me-2"></i>
            <span>Editar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
