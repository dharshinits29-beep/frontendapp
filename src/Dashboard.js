import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { validateField } from "./comfunc";
import { getDashboardUsers, addDashboardUser, updateUser, deleteUser } from "./api";


const Dashboard = ({ setToken }) => {
  const [user, setUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", confirmPass: "" });
  const [error, setError] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ username: "", email: "" });

  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const navigate = useNavigate();

  // Load logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const currentUser = { username: decoded.username, email: decoded.email };
      setUser(currentUser);
      setAllUsers([currentUser]);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch users for pagination (excluding first logged-in user)
  const fetchAddedUsers = async (page = 1) => {
    const data = await getDashboardUsers(page, limit);
    if (!data.error) {
      setAllUsers([user, ...data.users]);
      setTotalPages(data.totalPages);
    } else {
      setAllUsers([user]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    if (user) fetchAddedUsers(currentPage);
  }, [currentPage, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const handleAddUser = () => setShowAddUser(true);
  const handleCancel = () => {
    setShowAddUser(false);
    setNewUser({ username: "", email: "", password: "", confirmPass: "" });
    setError({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
    const fieldError = validateField(name, value, { ...newUser, [name]: value });
    setError((prev) => ({ ...prev, ...fieldError }));
  };

  const handleSave = async () => {
    let allErrors = {};
    Object.keys(newUser).forEach((field) => {
      allErrors = { ...allErrors, ...validateField(field, newUser[field], newUser) };
    });
    setError(allErrors);

    if (Object.keys(allErrors).length === 0) {
      const success = await addDashboardUser(newUser);
      if (success) {
        alert("User added successfully");
        handleCancel();
        fetchAddedUsers(currentPage);
      } else {
        alert("Failed to add user");
      }
    } else {
      alert("Please fix errors before saving");
    }
  };

  const startEditing = (u) => {
    setEditingUser(u.username);
    setEditData({ username: u.username, email: u.email });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const data = await updateUser(editingUser, editData.username, editData.email);
    if (data) {
      alert("User updated successfully");
      fetchAddedUsers(currentPage);
      if (editingUser === user.username) setUser({ username: data.user.username, email: data.user.email });
      setEditingUser(null);
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async (usernameToDelete) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    const data = await deleteUser(usernameToDelete);
    if (data) {
      alert("User deleted successfully");
      fetchAddedUsers(currentPage);
      if (usernameToDelete === user.username) {
        setUser(null);
        setToken(null);
        navigate("/login");
      }
    } else {
      alert("Delete failed");
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const styles = (
    <style>{`
      .dashboard { max-width: 800px; margin: 40px auto; font-family: Arial, sans-serif; }
      .dashboard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
      .dashboard-header-right { display: flex; flex-direction: column; align-items: flex-end; }
      .button-group { display: flex; flex-direction: column; gap: 8px; margin-top: 5px; }
      .logout-btn { background-color: #dc3545; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; }
      .logout-btn:hover { background-color: #b52a38; }
      .add-user-btn { background-color: #28a745; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; }
      .add-user-btn:hover { background-color: #218838; }
      .dashboard-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      .dashboard-table th, .dashboard-table td { border: 1px solid #ddd; padding: 10px; text-align: center; }
      .dashboard-table th { background-color: #f2f2f2; }
      .edit-btn, .delete-btn, .save-btn { padding: 6px 12px; border: none; border-radius: 4px; color: white; cursor: pointer; margin: 2px; }
      .edit-btn { background-color: #007bff; }
      .edit-btn:hover { background-color: #0056b3; }
      .delete-btn { background-color: #dc3545; }
      .delete-btn:hover { background-color: #b52a38; }
      .save-btn { background-color: #28a745; }
      .save-btn:hover { background-color: #218838; }
      .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
      .modal-content { background: white; padding: 20px; border-radius: 8px; width: 400px; box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
      .modal-table { width: 100%; margin-top: 10px; }
      .modal-table td { padding: 8px; }
      .modal-buttons { display: flex; justify-content: center; gap: 15px; margin-top: 15px; }
      .error-msg { color: red; font-size: 12px; margin-top: 4px; }
      .pagination { margin-top: 15px; text-align: center; }
      .pagination button { margin: 0 5px; padding: 5px 10px; border-radius: 4px; border: none; cursor: pointer; }
      .pagination .active { background-color: #007bff; color: white; }
      .pagination .inactive { background-color: #28a745; color: white; }
    `}</style>
  );

  return (
    <div className="dashboard">
      {styles}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-header-right">
          <span>Welcome {user?.username}</span>
          <div className="button-group">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
            <button className="add-user-btn" onClick={handleAddUser}>Add User</button>
          </div>
        </div>
      </header>

      <h3 style={{ marginTop: "20px" }}>Users</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((u) => (
            <tr key={u.username}>
              <td>
                {editingUser === u.username ? (
                  <input name="username" value={editData.username} onChange={handleEditChange} />
                ) : (
                  u.username
                )}
              </td>
              <td>
                {editingUser === u.username ? (
                  <input name="email" value={editData.email} onChange={handleEditChange} />
                ) : (
                  u.email
                )}
              </td>
              <td>
                {editingUser === u.username ? (
                  <button className="save-btn" onClick={handleUpdate}>Save</button>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => startEditing(u)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(u.username)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : "inactive"}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showAddUser && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add User</h3>
            <table className="modal-table">
              <tbody>
                <tr>
                  <td>Username</td>
                  <td>
                    <input type="text" name="username" value={newUser.username} onChange={handleChange} />
                    {error.username && <div className="error-msg">{error.username}</div>}
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>
                    <input type="email" name="email" value={newUser.email} onChange={handleChange} />
                    {error.email && <div className="error-msg">{error.email}</div>}
                  </td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>
                    <input type="password" name="password" value={newUser.password} onChange={handleChange} />
                    {error.password && <div className="error-msg">{error.password}</div>}
                  </td>
                </tr>
                <tr>
                  <td>Confirm Password</td>
                  <td>
                    <input type="password" name="confirmPass" value={newUser.confirmPass} onChange={handleChange} />
                    {error.confirmPass && <div className="error-msg">{error.confirmPass}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="delete-btn" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;