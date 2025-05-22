import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { login, saveToken } from "../services/auth";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (username: string, password: string) => {
    try {
      const result = await login({ username, password });
      saveToken(result.token);
      alert("Bienvenido! Token: " + result.token);
      // Here you would typically redirect to a protected page
      // navigate('/dashboard');
    } catch (error: any) {
      throw error;
    }
  };

  return <AuthForm isRegister={false} onSubmit={handleLogin} />;
}

export default Login;
