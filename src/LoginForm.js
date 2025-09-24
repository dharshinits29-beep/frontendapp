import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./api";

const LoginForm = ({setToken}) => {
  const [formData, setFormData] = useState({ username: "", password: "",email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    

    if (!formData.username || !formData.password || !formData.email) {
      setError("Please fill all fields.");
      return;
    }
    const result = await loginUser(formData.username,formData.password,formData.email);
    console.log("RESULT",result);
    if(!result){
      setError("Invalid username,password and email");
      return;
    }
    localStorage.setItem("token",result.token);
    setToken(result.token);
    alert("Login Succesfull");
    localStorage.setItem("isLogged", "true");
    navigate("/dashboard");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9"
      }}
    >
      <h2>Login</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px" }}>
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: "14px" }}>
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>
      <div style={{ marginBottom: "15px"}}>
        <label style={{display:"block", marginBottom: "bold", fontSize: "14px"}}>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange}
            style={{ width: "100%", padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {error && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{error}</p>}

      <button 
        type="submit" 
        style={{ 
          width: "100%", 
          padding: "10px", 
          backgroundColor: "#007BFF", 
          color: "#fff", 
          fontWeight: "bold", 
          fontSize: "16px", 
          borderRadius: "4px", 
          border: "none", 
          cursor: "pointer" 
        }} >
        Login
      </button>

      <p style={{ marginTop: "15px", fontSize: "14px", textAlign: "center" }}>
        Don't have an account?{" "}
        <span 
          onClick={() => navigate("/register")} 
          style={{ color: "#007BFF", cursor: "pointer", textDecoration: "underline" }}
        >
          Register here
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
