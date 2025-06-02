// login.js
import { api, saveToken } from "../../api/api.js";

/**
 * Registra un nuevo usuario.
 * @param {Object} user - Datos del usuario.
 * @param {string} user.nombre
 * @param {string} user.apellido
 * @param {string} user.correo
 * @param {string} user.contraseña
 * @returns {Promise} Respuesta del backend
 */
export const registerUser = async ({ nombre, apellido, correo, contraseña }) => {
  try {
    const body = { nombre, apellido, correo, contraseña };
    const response = await api.post("/auth/register", body);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al registrarse");
  }
};

/**
 * Inicia sesión con email y contraseña.
 * @param {Object} credentials
 * @param {string} credentials.correo
 * @param {string} credentials.contraseña
 * @returns {string} token JWT si es exitoso
 */
export const loginUser = async ({ correo, contraseña }) => {
  try {
    const { token } = await api.post("/auth/login", { correo, contraseña });
    saveToken(token);
    return token;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Error al iniciar sesión");
  }
};

/**
 * Elimina el token guardado y cierra sesión.
 */
export const logoutUser = () => {
  localStorage.removeItem("token"); // O la clave que uses para guardar el token
};

/**
 * Obtiene el token guardado en localStorage.
 * @returns {string|null} token JWT o null si no existe
 */
export const getToken = () => {
  return localStorage.getItem("token");
};
