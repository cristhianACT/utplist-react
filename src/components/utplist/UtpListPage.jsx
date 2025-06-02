import React, { useState, useEffect } from "react";
import NavbarSuperior from "./NavbarSuperior";
import EncabezadoPrincipal from "./EncabezadoPrincipal";
import ContenedorTareas from "./ContenedorTareas";
import ModalAgregarTarea from "./ModalAgregarTarea";
import { api, getToken, dropToken } from "../../api/api";
import Swal from "sweetalert2";

export default function UtpListPage({ onLogout, onToggleTheme }) {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [modoOscuro, setModoOscuro] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);

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
      <ContenedorTareas
        tareas={tareasFiltradas}
        onCambiarEstado={cambiarEstado}
        onEditar={editarTarea}
      />
      <ModalAgregarTarea
        onSave={handleSaveTask}
        tareaEditando={tareaEditando}
        setTareaEditando={setTareaEditando}
      />
    </>
  );
}
