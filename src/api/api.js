// src/api/api.js

// URL base del backend (puedes cambiarlo según donde esté tu API)
const API_URL = "http://localhost:8080/api"; // ¡IMPORTANTE: Asegúrate de que esta URL sea la correcta para tu backend!

/**
 * Guarda el token JWT en localStorage.
 * @param {string} token - Token recibido tras login.
 */
export function saveToken(token) {
  localStorage.setItem("jwt", token);
}

/**
 * Obtiene el token JWT almacenado.
 * @returns {string|null} Token JWT o null si no existe.
 */
export function getToken() {
  return localStorage.getItem("jwt");
}

/**
 * Elimina el token JWT (por ejemplo al hacer logout).
 */
export function dropToken() {
  localStorage.removeItem("jwt");
}

/**
 * Muestra un error con SweetAlert2.
 * @param {string} msg - Mensaje a mostrar.
 */
function showError(msg) {
  // eslint-disable-next-line no-undef
  Swal.fire({
    icon: "error",
    title: "¡Ups!",
    text: msg,
    confirmButtonColor: "#8e44ad",
  });
}

/**
 * Función genérica para hacer peticiones al backend.
 * Automáticamente agrega el JWT si está guardado.
 * @param {string} path - Ruta del endpoint (ej: '/login').
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, etc).
 * @param {Object|null} body - Datos a enviar (opcional).
 * @returns {Promise<Object|null>} Respuesta del backend o null si no hay contenido.
 */
async function request(path, method = "GET", body = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Si hay token, lo agregamos al header Authorization
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Hacemos la petición al backend
  const res = await fetch(`${API_URL}${path}`, options);

  if (res.ok) {
    // Si no hay contenido, retornamos null
    return res.status === 204 ? null : await res.json();
  }

  // Si hubo error, intentamos obtener el mensaje
  let msg = `Error ${res.status}`;
  try {
    const data = await res.json();
    msg = data.mensaje || data.message || JSON.stringify(data);
  } catch {
    msg = await res.text();
  }

  showError(msg);
  throw new Error(msg);
}

// Exportamos métodos fáciles para llamar a la API
export const api = {
  get: (path) => request(path, "GET"),
  post: (path, body) => request(path, "POST", body),
  put: (path, body) => request(path, "PUT", body),
  patch: (path, body) => request(path, "PATCH", body),
  delete: (path) => request(path, "DELETE"),
};