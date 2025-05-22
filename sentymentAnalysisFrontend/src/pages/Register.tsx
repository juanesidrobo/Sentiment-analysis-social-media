import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { register } from "../services/auth";

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (username: string, password: string) => {
    try {
      await register({ username, password });
      alert("Usuario registrado exitosamente!");
      navigate("/login");
    } catch (error: any) {
      throw error;
    }
  };

  return <AuthForm isRegister={true} onSubmit={handleRegister} />;
}

export default Register;
