import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import { jwtDecode } from "jwt-decode";
import { changePassword } from "./api";


const Resetpass = ({setToken})=>{
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmPass,setConfirmpass] = useState("");
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token){
            try{
                const decoded = jwtDecode(token);
                setUser({username:decoded.username});
            }catch(err){
                console.log("Invalid token",err);
            }
        }

    },[]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate("/login");
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if(!oldPassword || !newPassword || !confirmPass){
            setError("All field are required");
            return;
        }
        if(newPassword !== confirmPass){
            setError("New password and confirm password should be same")
        }
        try{
            const res =  await changePassword(oldPassword,newPassword);
            if(res && res.message){
                setSuccess(res.message);
                setOldPassword("");
                setNewPassword("");
            }else{
                setError("Failed to update password");
            }
        }catch(err){
            setError(err?.message || "Something went wrong");
        }
    };
    const styles = (
    <style>{`
      .reset-password-container { max-width: 400px; margin: 80px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; font-family: Arial, sans-serif; }
      .reset-password-container h2 { text-align: center; margin-bottom: 20px; }
      .reset-password-container label { display: block; margin-bottom: 6px; font-weight: bold; }
      .reset-password-container input { width: 100%; padding: 8px; margin-bottom: 12px; border-radius: 4px; border: 1px solid #ccc; }
      .reset-password-container button { width: 100%; padding: 10px; border: none; border-radius: 4px; background-color: #28a745; color: white; cursor: pointer; font-size: 16px; }
      .reset-password-container button:hover { background-color: #218838; }
      .error-msg { color: red; margin-bottom: 10px; }
      .success-msg { color: green; margin-bottom: 10px; }
      .back-btn { margin-top: 10px; width: 100%; padding: 10px; border: none; border-radius: 4px; background-color: #007bff; color: white; cursor: pointer; }
      .back-btn:hover { background-color: #0056b3; }
    `}</style>
  );
  return(
    <div>
        <Header user={user} onLogout={handleLogout} />
    <div className="reset-password-container">
        {styles}
        <h2>Reset Password</h2>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}
        <form onSubmit={handleSubmit}>
            <label>Old Password</label>
            <input type="password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}/>
            <label>New Password</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
            <label>Confirm Password</label>
            <input type="password" value={confirmPass} onChange={(e)=>setConfirmpass(e.target.value)}/>
            <button type="submit">Change Password</button>
        </form>
    </div>
    </div>
  );
};
export default Resetpass;       