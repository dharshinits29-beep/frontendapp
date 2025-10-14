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

export const loginUser = async (password, email) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, { password, email });
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

export const changePassword = async (oldPassword,newPassword) =>{
  try{
    const token = localStorage.getItem("token");
    const res = await axios.put(`${BASE_URL}/change-password`,{oldPassword,newPassword},
      {
        headers:{
          authentication:token,
        },
      }
    );
    return res.data;
  }catch(err){
    console.log(err.response?.data || err.message);
    return null;
  }
}

export const postProduct = async (productData) => {
  try {
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("productCategory", productData.productCategory);
    formData.append("tags", JSON.stringify(productData.tags)); 

    if (productData.productImage && productData.productImage.length > 0) {
      productData.productImage.forEach((file) => {
        formData.append("productImage", file);
      });
    }

    const res = await axios.post(`${BASE_URL}/products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data
  } catch (err) {
    console.log(err.response?.data || err.message);
    return null;
  }
};
export const getProduct = async ({ page, limit }) => {
  try {
    
    const res = await axios.get(`${BASE_URL}/addproduct`, {
      params: { page, limit },
    });


    if (res.data && Array.isArray(res.data.products)) {
      return res.data;
    } else {
      console.error("Unexpected response format:", res.data);
      return { products: [], totalPage: 1 };
    }
  } catch (err) {
    console.error("Error fetching products:", err.response?.data || err.message);
    return { products: [], totalPage: 1 }; 
  }
};


