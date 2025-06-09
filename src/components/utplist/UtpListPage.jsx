import React, { useState, useEffect } from "react";
import NavbarSuperior from "./NavbarSuperior";
import EncabezadoPrincipal from "./EncabezadoPrincipal";
import ContenedorTareas from "./ContenedorTareas";
import ModalAgregarTarea from "./ModalAgregarTarea";
import { api, getToken, dropToken } from "../../api/api";
import Swal from "sweetalert2";
import CalendarioTareas from "./CalendarioTareas";
import TarjetaTarea from "./TarjetaTarea";

export default function UtpListPage({ onLogout, onToggleTheme }) {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [modoOscuro, setModoOscuro] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [modalTareas, setModalTareas] = useState([]);
  const [modalDia, setModalDia] = useState(null);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    async function fetchTareas() {
      if (!getToken()) {
        window.location.href = "/Login.html";
        return;
      }
      try {
        const fetchedTasks = await api.get("/tareas");
        setTareas(fetchedTasks);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    }
    fetchTareas();
  }, []);

  const tareasFiltradas = tareas.filter((tarea) => {
    const hoyStr = new Date().toISOString().slice(0, 10);
    if (filtro === "todas") return true;
    if (filtro === "hoy") return tarea.fecha === hoyStr;
    if (filtro === "en_proceso") return tarea.estado === "EN_PROCESO";
    if (filtro === "completado") return tarea.estado === "COMPLETADO";
    return true;
  });

  const tareasPendientes = tareas.filter((t) => t.estado !== "COMPLETADO").length;

  const fechaActual = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function cambiarEstado(id, nuevoEstado) {
    try {
      const updated = await api.patch(`/tareas/${id}/estado?estado=${nuevoEstado}`);
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, estado: updated.estado } : t))
      );
      Swal.fire("¡Actualizado!", "Estado de la tarea cambiado correctamente.", "success");
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea:", error);
    }
  }

  function editarTarea(id) {
    const tarea = tareas.find((t) => t.id === id);
    if (tarea) {
      setTareaEditando(tarea);
      const modalElement = document.getElementById("modalAgregarTarea");
      const bootstrapModal = new window.bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  async function handleSaveTask(savedTask, isEditing) {
    if (isEditing) {
      setTareas((prev) =>
        prev.map((t) => (t.id === savedTask.id ? savedTask : t))
      );
    } else {
      setTareas((prev) => [...prev, savedTask]);
    }
    setTareaEditando(null);
  }

  const handleFiltroChange = (newFiltro) => {
    setFiltro(newFiltro);
  };

  function toggleTema() {
    setModoOscuro((prev) => !prev);
  }

  useEffect(() => {
    if (modoOscuro) {
      document.body.classList.add("dark-mode");
      document.body.setAttribute("data-bs-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.setAttribute("data-bs-theme", "light");
    }
  }, [modoOscuro]);

  async function limpiarCompletadas() {
    const toDelete = tareas.filter((t) => t.estado === "COMPLETADO");
    if (!toDelete.length) {
      Swal.fire("No hay tareas", "No hay tareas completadas para eliminar.", "info");
      return;
    }
    const { isConfirmed } = await Swal.fire({
      icon: "question",
      title: `¿Eliminar ${toDelete.length} tarea${toDelete.length > 1 ? "s" : ""} completada${toDelete.length > 1 ? "s" : ""}?`,
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    });
    if (!isConfirmed) return;
    try {
      for (const t of toDelete) {
        await api.delete(`/tareas/${t.id}`);
      }
      setTareas((prev) => prev.filter((t) => t.estado !== "COMPLETADO"));
      Swal.fire("¡Eliminadas!", "Tareas completadas eliminadas exitosamente.", "success");
    } catch (error) {
      console.error("Error al limpiar tareas completadas:", error);
    }
  }

  function logout() {
    dropToken();
    window.location.href = "/Login.html";
  }

  // --- Lógica para mostrar tareas simplificadas y paginación ---
  const tareasSimplificadas = tareas.map(t => ({
    id: t.id,
    nombre: t.nombre,
    fecha: t.fecha,
    estado: t.estado
  }));
  const [paginaTareas, setPaginaTareas] = useState(0);
  const tareasPorPagina = 4;
  const totalPaginas = Math.ceil(tareasSimplificadas.length / tareasPorPagina);
  const tareasPagina = tareasSimplificadas.slice(paginaTareas * tareasPorPagina, (paginaTareas + 1) * tareasPorPagina);

  // Renderizar el modal con las tarjetas completas de las tareas del día seleccionado
  const renderModal = () => {
    if (!modalDia || !modalTareas.length) return null;
    const tareaActual = modalTareas[modalIndex];
    return (
      <div className="modal fade show" style={{display:'block', background:'rgba(0,0,0,0.3)'}} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" style={{maxWidth: '700px', minWidth: '420px'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tarea del {modalDia} ({modalIndex+1} de {modalTareas.length})</h5>
              <button type="button" className="btn-close" onClick={() => {setModalDia(null); setModalTareas([]); setModalIndex(0);}}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3" style={{gap: '18px'}}>
                <button className="btn btn-outline-secondary" style={{height: 48, width: 48, fontSize: 22}} disabled={modalIndex === 0} onClick={() => setModalIndex(i => i-1)}>&lt;</button>
                <div style={{flex:1, minWidth:0, margin:'0 10px', maxWidth: 600}}>
                  <TarjetaTarea
                    tarea={tareaActual}
                    onCambiarEstado={cambiarEstado}
                    onEditar={editarTarea}
                  />
                </div>
                <button className="btn btn-outline-secondary" style={{height: 48, width: 48, fontSize: 22}} disabled={modalIndex === modalTareas.length-1} onClick={() => setModalIndex(i => i+1)}>&gt;</button>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => {setModalDia(null); setModalTareas([]); setModalIndex(0);}}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <NavbarSuperior
        onToggleTheme={onToggleTheme}
        onCleanCompleted={limpiarCompletadas}
        onLogout={logout}
        onFiltroChange={handleFiltroChange}
      />
      <EncabezadoPrincipal
        fechaActual={fechaActual}
        tareasPendientes={tareasPendientes}
      />
      <div style={{display:'flex', gap:48, alignItems:'flex-start', maxWidth:1400, margin:'0 auto'}}>
        <div style={{flex:2}}>
          <CalendarioTareas tareas={tareas} onDiaClick={(dia, tareasDia) => {setModalDia(dia); setModalTareas(tareasDia); setModalIndex(0);}} />
        </div>
        <div style={{
          flex:1,
          minWidth:320,
          borderLeft: '2px solid #444',
          paddingLeft: 32,
          marginLeft: 0,
          height: '100%',
          boxSizing: 'border-box',
          ...(window.innerWidth < 900 ? {borderLeft: 'none', paddingLeft: 0, marginTop: 32} : {})
        }}>
          <h5 className="mb-3">Tareas del mes</h5>
          {tareasSimplificadas.length === 0 && <div className="text-muted">No hay tareas este mes.</div>}
          {tareasPagina.map(t => (
            <div key={t.id} className="mb-3 p-3 rounded" style={{border:'1px solid #e0e0e0', background:'#fff'}}>
              <div style={{fontWeight:600}}>{t.nombre}</div>
              <div className="text-muted small"><i className="bi bi-calendar3 me-2"></i>{t.fecha}</div>
              <span className={`badge ${t.estado === 'COMPLETADO' ? 'bg-success' : t.estado === 'EN_PROCESO' ? 'bg-primary' : 'bg-secondary'} text-white`}>
                {t.estado === 'COMPLETADO' ? 'Completado' : t.estado === 'EN_PROCESO' ? 'En Proceso' : 'Pendiente'}
              </span>
            </div>
          ))}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <button className="btn btn-outline-secondary" style={{height:36, width:36}} disabled={paginaTareas === 0} onClick={() => setPaginaTareas(p => p-1)}>&lt;</button>
              <span style={{fontWeight:500}}>{paginaTareas+1} / {totalPaginas}</span>
              <button className="btn btn-outline-secondary" style={{height:36, width:36}} disabled={paginaTareas === totalPaginas-1} onClick={() => setPaginaTareas(p => p+1)}>&gt;</button>
            </div>
          )}
        </div>
      </div>
      {renderModal()}
      <ModalAgregarTarea
        onSave={handleSaveTask}
        tareaEditando={tareaEditando}
        setTareaEditando={setTareaEditando}
      />
    </>
  );
}
