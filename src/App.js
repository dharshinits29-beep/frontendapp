import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import Profile from "./profile";
import Resetpass from "./resetpass";
import AddProduct from "./addproduct";
import Home from "./Home";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register"element={token ? <Navigate to="/dashboard" /> : <RegistrationForm /> } />
          <Route path="/login"  element={token ? <Navigate to="/home" /> : <LoginForm setToken={setToken} />} />
          <Route path="/home" element={token ? <Home setToken={setToken}/> : <Navigate to="/login"/>}/>
          <Route path="/dashboard" element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/login" />}  />
          <Route path="/profile" element={token ? <Profile setToken={setToken} /> : <Navigate to ="/login"/>}/>
          <Route path="/resetpass" element={token ? <Resetpass setToken={setToken} /> : <Navigate to ="/login"/>}/>
          <Route path="/addproduct" element={token ? <AddProduct setToken={setToken} />: <Navigate to="/login"/>}/>
          <Route path="*" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
