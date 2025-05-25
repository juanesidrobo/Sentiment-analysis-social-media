// import { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
//   useNavigate,
// } from "react-router-dom";
// import "./App.css";

// function LoginRegisterForm() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const isRegister = location.pathname === "/register"; // 🚀 Detecta la ruta automáticamente

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const endpoint = isRegister ? "register" : "login";

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username, password }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.detail);
//       }

//       if (isRegister) {
//         alert("Usuario registrado exitosamente!");
//         navigate("/login"); // 🚀 Redirige a login automáticamente después de registrarse
//       } else {
//         alert("Bienvenido! Token: " + data.token);
//       }
//     } catch (error: any) {
//       alert("Error: " + error.message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={handleSubmit}>
//         <h2>{isRegister ? "Register" : "Login"}</h2>
//         <div className="input-box">
//           <FontAwesomeIcon icon={faUser} />
//           <input
//             type="text"
//             placeholder="username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="input-box">
//           <FontAwesomeIcon icon={faLock} />
//           <input
//             type="password"
//             placeholder="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <a href="#" className="forgot">
//           Forgot your password?
//         </a>
//         <button type="submit" className="login-btn">
//           {isRegister ? "Register" : "Login"}
//         </button>
//       </form>
//       <h5 className="text">
//         {isRegister ? "Si ya tienes cuenta" : "Si no tienes cuenta"}
//         <button
//           onClick={() => navigate(isRegister ? "/login" : "/register")}
//           className="btnswitch"
//         >
//           {isRegister ? "Inicia sesión" : "Regístrate"}
//         </button>
//       </h5>
//     </div>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginRegisterForm />} />
//         <Route path="/register" element={<LoginRegisterForm />} />
//         {/* También podrías redirigir / a /login si quieres */}
//       </Routes>
//     </Router>
//   );
// }

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navigationtest from "./pages/sentimentAnalysis";
import "./App.css";
import { isAuthenticated } from "./services/auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sentimentAnaylisis" element={<Navigationtest />} />

        {/* Redirect to login from root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Add a protected route example (uncomment when needed) */}
        {/* 
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
          } 
        />
        */}

        {/* Fallback for 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
