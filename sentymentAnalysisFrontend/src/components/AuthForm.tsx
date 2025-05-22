import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

type AuthFormProps = {
  isRegister: boolean;
  onSubmit: (username: string, password: string) => Promise<void>;
};

function AuthForm({ isRegister, onSubmit }: AuthFormProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onSubmit(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {error && <div className="error-message">{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Register" : "Login"}</h2>

        <div className="input-box">
          <FontAwesomeIcon icon={faUser} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="input-box">
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {!isRegister && (
          <a href="#" className="forgot">
            Forgot your password?
          </a>
        )}

        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? "Loading..." : isRegister ? "Register" : "Login"}
        </button>
      </form>

      <h5 className="text">
        {isRegister ? "Si ya tienes cuenta" : "Si no tienes cuenta"}
        <button
          onClick={() => navigate(isRegister ? "/login" : "/register")}
          className="btnswitch"
          disabled={isLoading}
        >
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </button>
      </h5>
    </div>
  );
}

export default AuthForm;
