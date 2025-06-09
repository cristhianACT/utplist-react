import React, { useState } from "react";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  // Devuelve 0 (lunes) a 6 (domingo) en formato ISO
  let jsDay = new Date(year, month, 1).getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarioTareas({ tareas, onDiaClick }) {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());

  const diasMes = getDaysInMonth(anioActual, mesActual);
  const primerDiaSemana = getFirstDayOfWeek(anioActual, mesActual);

  // Navegación de meses
  const cambiarMes = (delta) => {
    let nuevoMes = mesActual + delta;
    let nuevoAnio = anioActual;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio--;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio++;
    }
    setMesActual(nuevoMes);
    setAnioActual(nuevoAnio);
  };

  // Construir matriz de días para el calendario
  const celdas = [];
  for (let i = 0; i < primerDiaSemana; i++) {
    celdas.push(null); // Días vacíos al inicio
  }
  for (let d = 1; d <= diasMes; d++) {
    celdas.push(d);
  }
  while (celdas.length % 7 !== 0) {
    celdas.push(null); // Días vacíos al final
  }

  // Agrupar tareas por día
  const tareasPorDia = {};
  tareas.forEach(tarea => {
    if (!tarea.fecha) return;
    const fecha = new Date(tarea.fecha);
    if (fecha.getFullYear() === anioActual && fecha.getMonth() === mesActual) {
      const dia = fecha.getDate();
      if (!tareasPorDia[dia]) tareasPorDia[dia] = [];
      tareasPorDia[dia].push(tarea);
    }
  });

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto 2rem auto", background: "var(--bs-body-bg, #fff)", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: 16, position:'relative' }}>
      <div className="d-flex justify-content-center align-items-center mb-3" style={{gap: 16}}>
        <button className="btn btn-outline-secondary" style={{height:36, width:36}} onClick={() => cambiarMes(-1)}>&lt;</button>
        <h3 className="text-center mb-0" style={{letterSpacing:2, flex:1}}>
          {new Date(anioActual, mesActual).toLocaleString("es-ES", { month: "long", year: "numeric" }).toUpperCase()}
        </h3>
        <button className="btn btn-outline-secondary" style={{height:36, width:36}} onClick={() => cambiarMes(1)}>&gt;</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {diasSemana.map(dia => (
          <div key={dia} className="calendario-header" style={{ fontWeight: 600, textAlign: "center", padding: 6, borderRadius: 6, fontSize: 15 }}>{dia}</div>
        ))}
        {celdas.map((dia, idx) => (
          <div
            key={idx}
            className="calendario-celda"
            style={{ minHeight: 70, border: "1px solid #e0e0e0", borderRadius: 8, padding: 4, background: dia ? "#fff" : "#f4f4f4", cursor: tareasPorDia[dia] ? 'pointer' : 'default' }}
            onClick={() => tareasPorDia[dia] && onDiaClick && onDiaClick(dia, tareasPorDia[dia])}
          >
            {dia && (
              <>
                <div className="calendario-dia" style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{dia}</div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {(tareasPorDia[dia] || []).map(t => (
                    <li key={t.id} className="calendario-tarea" style={{ fontSize: 13, background: "#11cbff11", borderRadius: 4, marginBottom: 2, padding: "2px 4px" }}>{t.nombre}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 