// src/components/utplist/ModalAgregarTarea.jsx
import React, { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import Swal from "sweetalert2";
import { api } from "../../api/api";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function ModalAgregarTarea({ onSave, tareaEditando, setTareaEditando }) {
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    descripcion: "",
    fecha: "",
  });

  useEffect(() => {
    if (tareaEditando) {
      setFormData({
        nombre: tareaEditando.nombre,
        categoria: tareaEditando.categoria,
        descripcion: tareaEditando.descripcion,
        fecha: tareaEditando.fecha,
      });
    } else {
      setFormData({
        nombre: "",
        categoria: "",
        descripcion: "",
        fecha: "",
      });
    }
  }, [tareaEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hoyISO = new Date().toISOString().slice(0, 10);
    if (formData.fecha < hoyISO) {
      return Swal.fire("Fecha inválida", "No se permiten fechas pasadas.", "warning");
    }
    try {
      let savedTask;
      let isEditing = false;
      if (tareaEditando) {
        savedTask = await api.put(`/tareas/${tareaEditando.id}`, { ...formData, estado: tareaEditando.estado });
        isEditing = true;
      } else {
        savedTask = await api.post("/tareas", { ...formData, estado: "PENDIENTE" });
      }
      onSave(savedTask, isEditing);
      // Limpia el formulario y resetea el estado de edición
      setFormData({ nombre: "", categoria: "", descripcion: "", fecha: "" });
      setTareaEditando(null);
      // Ocultar el modal de Bootstrap
      const modal = Modal.getInstance(document.getElementById("modalAgregarTarea"));
      if (modal) modal.hide();
      // Eliminar cualquier backdrop que quede
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      Swal.fire("¡Éxito!", `Tarea ${isEditing ? "actualizada" : "guardada"} correctamente.`, "success");
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
    }
  };

  return (
    <div className="modal fade" id="modalAgregarTarea" tabIndex="-1" aria-labelledby="modalAgregarTareaLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title" id="modalAgregarTareaLabel">
                {tareaEditando ? "Editar Tarea" : "Agregar Nueva Tarea"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombreTarea" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreTarea"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="categoriaTarea" className="form-label">Categoría</label>
                <select
                  className="form-select"
                  id="categoriaTarea"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Seleccionar</option>
                  <option value="CASA">CASA</option>
                  <option value="UNIVERSIDAD">UNIVERSIDAD</option>
                  <option value="TRABAJO">TRABAJO</option>
                  <option value="OTROS">OTROS</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="fechaTarea" className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaTarea"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="descripcionTarea" className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  id="descripcionTarea"
                  name="descripcion"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary w-100">
                {tareaEditando ? "Actualizar Tarea" : "Guardar Tarea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
