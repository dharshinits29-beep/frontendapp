import axios from "axios";
const BASE_URL = "http://localhost:5001";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { authentication: token };
};

export const getUserByUsername = async (username) => {
  try {
    const res = await axios.get(`${BASE_URL}/users/${username}`);
    return res.data; 
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const registerUser = async (user) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, user);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return false;
  }
};
export const addDashboardUser = async (user) => {
  try{
    const res=await axios.post(`${BASE_URL}/dashboard/add-user`,user);
    return res.data;
  }catch(err){
    console.log(err.response?.data || err.message);
    return false;
  }
};

export const loginUser = async (username, password, email) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, { username, password, email });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};


export const updateUser = async (oldUsername, username, email) => {
  try {
    const res = await axios.put(`${BASE_URL}/users/${oldUsername}`, { newUsername:username, newEmail:email });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const deleteUser = async (username) => {
  try {
    const res = await axios.delete(`${BASE_URL}/users/${username}`);
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const getDashboardUsers = async (page = 1, limit = 5) => {
  try {
    
    const res = await axios.get(`${BASE_URL}/dashboard/add-users`, {
      params: { page, limit }
    });

    return res.data;  
  } catch (err) {
    return { error: err.response?.data?.message || "Something went wrong" };
  }
};

export const updateProfile = async ({ username, email, file }) => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (file) formData.append("profile_image", file || "");

    const res = await axios.put(`${BASE_URL}/profile`, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data", 
      },
    });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${BASE_URL}/profile`, {
      headers: { authentication: token }
    });
    return res.data;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};
