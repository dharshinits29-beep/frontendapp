import { useState, useEffect } from "react";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile } from "./api"; 

const Profile = ({setToken}) => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    profile_image: null, 
  });

  const [preview, setPreview] = useState(null); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProfileData = async () => {
      const data = await getProfile();
      if (data) {
        setUser({
          username: data.username,
          email: data.email,
          profile_image: null, 
        });
        if (data.profile_image) {
          setPreview(`http://localhost:5001/uploads/${data.profile_image}`);
        }
      }
    };
    fetchProfileData();
  }, []);


  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setUser({ ...user, profile_image: file });
      setPreview(URL.createObjectURL(file)); 
    }
  };


  const handleUpdate = async () => {
    const data = await updateProfile({
      username: user.username,
      email: user.email,
      file: user.profile_image, 
    });

    if (data) {
      alert(data.message);
    
      if (data.user.profile_image) {
        setPreview(`http://localhost:5001/uploads/${data.user.profile_image}`);
        setUser({ ...user, profile_image: null }); 
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  const styles = {
    container: {
      maxWidth: "400px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
    },
    title: { textAlign: "center", marginBottom: "20px", color: "#333" },
    imageContainer: { textAlign: "center", marginBottom: "20px" },
    profileImage: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #007bff",
    },
    input: {
      width: "100%",
      padding: "8px",
      marginTop: "5px",
      marginBottom: "15px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box",
    },
    label: { fontWeight: "bold", display: "block", marginBottom: "5px", color: "#555" },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "10px",
    },
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />
    
    <div style={styles.container}>
      <h2 style={styles.title}>My Profile</h2>

      <div style={styles.imageContainer}>
        <img
          src={preview || "/default.png"}
          alt="Profile"
          style={styles.profileImage}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: "10px" }}
        />
      </div>

      <div>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          style={styles.input}
        />
      </div>

      <div>
        <label style={styles.label}>Email:</label>
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={styles.input}
        />
      </div>

      <button onClick={handleUpdate} style={styles.button}>
        Update Profile
      </button>

    </div>
    </div>
  );
};

export default Profile;
