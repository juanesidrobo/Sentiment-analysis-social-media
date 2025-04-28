import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = register ? "register" : "login"; // Cambia dependiendo del modo

    try {
      const response = await fetch(`http://127.0.0.1:8000/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail);
      }

      if (register) {
        alert("Usuario registrado exitosamente!");
        setRegister(false); // Después de registrar, regresar a login
      } else {
        alert("Bienvenido! Token: " + data.token);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-box">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <a href="#" className="forgot">
          Forgot your password?
        </a>
        <button type="submit" className="login-btn">
          {register ? "Register" : "Login"}
        </button>
      </form>
      <h5 className="text">
        {register ? "Si ya tienes cuenta" : "Si no tienes cuenta"}
        <button onClick={() => setRegister(!register)} className="btnswitch">
          {register ? "Inicia sesion" : "Registrate"}
        </button>
      </h5>
    </div>
  );
}

export default App;
