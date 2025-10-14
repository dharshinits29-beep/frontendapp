import { useNavigate } from "react-router-dom";

const Header =({user,onLogout,showDashboardOnly})=>{
    const navigate = useNavigate();
    return(
        <header style={styles.header}>
            <div style={styles.left}></div>
            <div style={styles.right}>
                {showDashboardOnly ?(
                    <button style={styles.button} onClick={()=>navigate("/dashboard")}>Dashboard</button>):(
                <>
                <span>Welcome, {user?.username}</span>
                <button style={styles.button} onClick={onLogout}>Logout</button>
                <button style={styles.button} onClick={()=>navigate("/profile")}>Profile</button>
                <button style={styles.button} onClick={()=>navigate("/resetpass")}>Reset Password</button>
                <button style={styles.button} onClick={()=>navigate("/dashboard")}>Dashboard</button>
                </>)}
            </div>
        </header>
    );
}
  const styles = {
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#f5f5f5", borderBottom: "1px solid #ddd" },
  right: { display: "flex", alignItems: "center", gap: "10px" },
  button: { padding: "6px 12px", border: "none", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", cursor: "pointer" }
};

export default Header;
            