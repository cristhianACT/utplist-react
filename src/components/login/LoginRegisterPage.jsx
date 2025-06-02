import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';
import { saveToken } from '../../api/api'; 
import { registerUser, loginUser } from '../login/login.js';

const LoginRegisterPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados del registro
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

  // Estados del login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ nombre: regNombre, apellido: regApellido, correo: regEmail, contraseña: regPass });
      alert("🎉 Registro exitoso. Ahora inicia sesión.");
      setIsRegistering(false);
    } catch (err) {
      alert("Error al registrarse: " + err.message);
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const token = await loginUser({ correo: loginEmail, contraseña: loginPass });
    saveToken(token);
    onLogin();  // <-- Esto hace que App cambie a página principal
  } catch (err) {
    alert("Credenciales inválidas: " + err.message);
  }
};

  return (
    <div className={`container mt-5 mb-5 ${isRegistering ? "active" : ""}`} id="container">
      {/* Registro */}
      <div className="form-container sign-up">
        <form onSubmit={handleRegister}>
          <h1>Crear cuenta</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
          </div>
          <span>o usa tu correo</span>
          <input type="text" placeholder="Nombre" required value={regNombre} onChange={e => setRegNombre(e.target.value)} />
          <input type="text" placeholder="Apellido" required value={regApellido} onChange={e => setRegApellido(e.target.value)} />
          <input type="email" placeholder="Correo electrónico" required value={regEmail} onChange={e => setRegEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" required minLength="6" value={regPass} onChange={e => setRegPass(e.target.value)} />
          <button type="submit">Registrarse</button>
        </form>
      </div>

      {/* Login */}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>¡Bienvenido!</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
          </div>
          <span>Ingresa tus datos</span>
          <input type="email" placeholder="Correo electrónico" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" required value={loginPass} onChange={e => setLoginPass(e.target.value)} />
          <a href="#">¿Olvidaste tu contraseña?</a>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>

      {/* Panel de transición */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>¡Bienvenido de nuevo!</h1>
            <p>Ingresa tus datos personales para usar el sitio</p>
            <button className="hidden" onClick={() => setIsRegistering(false)}>Iniciar sesión</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>¡Hola, amigo!</h1>
            <p>Regístrate con tus datos personales</p>
            <button className="hidden" onClick={() => setIsRegistering(true)}>Registrarse</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
