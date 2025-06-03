import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SentimentAnalysisPage from "./pages/sentimentAnalysis"; // Nombre más claro
import "./App.css";
import { isAuthenticated } from "./services/auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Corregir la ruta para que coincida */}
        <Route path="/sentiment-analysis" element={<SentimentAnalysisPage />} />
        
        {/* Redirect to login from root */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Fallback for 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;