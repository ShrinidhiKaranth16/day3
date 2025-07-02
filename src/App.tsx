import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./authentication/auth";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
