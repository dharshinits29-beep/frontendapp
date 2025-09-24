import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, getUserByUsername } from "./api";
import {validateField} from "./comfunc"

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPass: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  
  const handleChange = (event) => {
  const { name, value } = event.target;
  console.log("handleChange");
  setFormData((prev) => ({ ...prev, [name]: value }));

  const fieldError = validateField(name, value, { ...formData, [name]: value });

  setErrors((prev) => {
    const newErrors = { ...prev, ...fieldError };

    Object.keys(newErrors).forEach((key) => {
      if (newErrors[key] === undefined) delete newErrors[key];
    });
    
    return newErrors;
  });
};

  const handleSubmit = async (event) => {
    console.log("HANDLESUBMIT");
  event.preventDefault();
  
  let allErrors = {};
  Object.keys(formData).forEach((field) => {
    allErrors = { ...allErrors, ...validateField(field, formData[field], formData) };
    console.log("ALLERRORS");
  });

  
  Object.keys(allErrors).forEach((key) => {
    if (allErrors[key] === undefined) delete allErrors[key];
  });

  setErrors(allErrors);
  console.log("All validationerror",allErrors);

  if (Object.keys(allErrors).length > 0) {
    alert("Please fix the errors before submitting");
    return;
  }

  if (
    !formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPass.trim()
  ) {
    console.log("EMPTY FIELD ERROR");
    alert("All fields are required");
    return;
  }
    console.log("Checking if username exists:", formData.username);

  const existingUser = await getUserByUsername(formData.username);
  console.log("existing user",existingUser);
  if (existingUser) {
    alert("Username already exists");
    return;
  }
  console.log("register API",formData)

  const success = await registerUser({
    username: formData.username,
    email: formData.email,
    password: formData.password,
  });
  console.log("registeruser response",success);

  if (success) {
    console.log("user register success",success);
    alert("Registration Successful");
    setFormData({ username: "", email: "", password: "", confirmPass: "" });
    setErrors({});
    navigate("/login");
    console.log("REGISTERLOGIN");
  } else {
    alert("Registration failed. Please try again");
    console.log("REGISTER");
  }
};

  const styles = {
    form: {
      maxWidth: "400px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "6px",
      fontSize: "14px",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "8px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      marginBottom: "12px",
      boxSizing: "border-box",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginTop: "-10px",
      marginBottom: "12px",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      fontWeight: "bold",
      fontSize: "16px",
      cursor: "pointer",
    },
    loginText: {
      marginTop: "15px",
      fontSize: "14px",
      textAlign: "center",
      color: "#555",
    },
    loginLink: {
      color: "#007BFF",
      cursor: "pointer",
      textDecoration: "underline",
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>

      <label htmlFor="username" style={styles.label}>Name:</label>
      <input
        type="text"
        name="username"
        id="username"
        value={formData.username}
        onChange={handleChange}
        maxLength={50}
        style={styles.input}
      />
      {errors.username && <p style={styles.error}>{errors.username}</p>}

      <label htmlFor="email" style={styles.label}>Email:</label>
      <input
        type="email"
        name="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        style={styles.input}
      />
      {errors.email && <p style={styles.error}>{errors.email}</p>}

      <label htmlFor="password" style={styles.label}>Password:</label>
      <input
        type="password"
        name="password"
        id="password"
        value={formData.password}
        onChange={handleChange}
        maxLength={8}
        style={styles.input}
      />
      {errors.password && <p style={styles.error}>{errors.password}</p>}

      <label htmlFor="confirmPass" style={styles.label}>Confirm Password:</label>
      <input
        type="password"
        name="confirmPass"
        id="confirmPass"
        value={formData.confirmPass}
        onChange={handleChange}
        style={styles.input}
      />
      {errors.confirmPass && <p style={styles.error}>{errors.confirmPass}</p>}

      <button type="submit" style={styles.button}>Register</button>

      <p style={styles.loginText}>
        Already have an account?{" "}
        <span style={styles.loginLink} onClick={() => navigate("/login")}>
          Login here
        </span>
      </p>
    </form>
  );
};

export default RegistrationForm;
