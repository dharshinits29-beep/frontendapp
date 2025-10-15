import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProduct } from "./api";

const Home = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [exDescription,setExDescription] = useState({});
  const [totalPage, setTotalPage] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const limit = 10;

  const toggleDescription = (id)=>{
    setExDescription((prev)=>({...prev,[id]:!prev[id],
    }));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNumber) => {
  try {
    const data = await getProduct({ page: pageNumber, limit });

    setProduct((prev) => {
      const all = [...prev, ...data.products];
      const unique = all.filter(
        (item, index, self) => index === self.findIndex((p) => p.id === item.id)
      );
      return unique;
    });

    setTotalPage(data.totalPage);
  } catch (err) {
    console.error(err);
  }
};


  const handleAddProduct=()=>{
    navigate("/addproduct")
  }

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target.scrollingElement || document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10 && page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, totalPage]);

  const nextImage = (id, count) => {
    setCurrentImageIndex((prev) => ({
      ...prev,[id]: (prev[id] || 0) + 1 < count ? (prev[id] || 0) + 1 : 0,
    }));
  };

  const prevImage = (id, count) => {
    setCurrentImageIndex((prev) => ({
      ...prev,[id]: prev[id] > 0 ? prev[id] - 1 : count - 1,
    }));
  };

  const styles = {
    homeContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "30px",
      gap: "25px",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh",
    },
    productCard: {
      width: "90%",
      maxWidth: "600px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      alignItems: "center",
    },
    productImageContainer: {
      position: "relative",
      width: "150px", 
      height: "150px", 
      borderRadius: "8px",
      overflow: "hidden",
      flexShrink: 0,
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    arrows: {
      position: "absolute",
      top: "50%",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      transform: "translateY(-50%)",
    },
    button: {
      backgroundColor: "rgba(255,255,255,0.8)",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
      borderRadius: "50%",
      width: "25px",
      height: "25px",
    },
    info: {
      flex: 1,
    },
    line: {
      margin: "5px 0",
      fontSize: "15px",
    },
    label: {
      fontWeight: "bold",
      color: "#333",
    },
    value: {
      color: "#555",
    },
  };

  return (
    <div style={styles.homeContainer}>
        <button className="add-produtct-btn" onClick={handleAddProduct}>Add product</button>
      {product.map((item) => {
        const images = Array.isArray(item.image)
          ? item.image
          : typeof item.image === "string" && item.image !== ""
          ? JSON.parse(item.image)
          : [];
        const index = currentImageIndex[item.id] || 0;

        return (
          <div key={item.id} style={styles.productCard}>
            <div style={styles.productImageContainer}>
              {
                <img    
                  src={ `http://localhost:5001/productUploads/${images[index]}`}
                  alt={item.productName || "Default product"}
                  style={styles.image}
                  onError={(e)=>{
                    e.target.onerror = null;
                    e.target.src="/default-thumnail.png"
                  }}
                />
              } 
              {images.length > 1 && (
                <div style={styles.arrows}>
                  <button
                    style={styles.button}
                    onClick={() => prevImage(item.id, images.length)} > ◀ </button>
                  <button
                    style={styles.button}
                    onClick={() => nextImage(item.id, images.length)} > ▶</button>
                </div>
              )}
            </div>

            <div style={styles.info}>
              <div style={styles.line}>
                <span style={styles.label}>Product Name: </span>
                <span style={styles.value}>{item.productName}</span>
              </div>
              <div style={styles.line}>
                <span style={styles.label}>Price: </span>
                <span style={styles.value}>₹{Number(item.price).toLocaleString('en-IN')}</span>
              </div>
              <div style={styles.line}>
                <span style={styles.label}>Description: </span>
                <span style={styles.value}>
                  {item.description.length > 500 ? (<>
                  <span dangerouslySetInnerHTML={{__html:exDescription[item.id]?item.description:item.description.slice(0,500)+"...", }}/>
                  <span style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
                  onClick={()=>toggleDescription(item.id)}>
                    {exDescription[item.id]?"See less":"See more"}</span></>):(
                      <span dangerouslySetInnerHTML={{__html:item.description,}}/>)}</span></div>
              <div style={styles.line}> 
                <span style={styles.label}>Tags: </span>
                <span style={styles.value}>
                  {Array.isArray(item.tags) ? item.tags.join(", ") : item.tags}
                </span>
              </div>
              <div style={styles.line}>
                <span style={styles.label}>Category: </span>
                <span style={styles.value}>{item.productCategory}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
