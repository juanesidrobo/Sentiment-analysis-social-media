import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { login, saveToken } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await login({ username, password });
      saveToken(result.token);
      navigate("/sentiment-analysis"); // Corregir la ruta
      alert("Bienvenido! Token: " + result.token);
    } catch (error: any) {
      throw error;
    }
  };

  return <AuthForm isRegister={false} onSubmit={handleLogin} />;
}

export default Login;