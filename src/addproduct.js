import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postProduct } from "./api";
import Header from "./header";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Multiselect from "multiselect-react-dropdown";

const AddProduct = () => {
  const category = ["Electronics", "Mobiles", "Home Appliances"];
  const defaultTags = [
    "TV","AC","Fridge","Washing Machine","Laptop","Mobile","Camera","Headphones","Smartwatch"];

  
  const tagOptions = defaultTags.map(tag => ({ name: tag }));

  const [product, setProduct] = useState({
    productName: "",
    productImage: [],
    price: "",
    description: "",
    tags: [], 
    productCategory: "",
  });

  const [error, setError] = useState({});
  const [editorData, setEditorData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "productImage") {
      setProduct((prev) => ({
        ...prev,
        productImage: [...prev.productImage, ...Array.from(files)]
      }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      productImage: prev.productImage.filter((_, i) => i !== indexToRemove),
    }));
  };

  const onSelect = (selectedList) => {
    setProduct((prev) => ({ ...prev, tags: selectedList.map(item => item.name) }));
  };

  const onRemove = (selectedList) => {
    setProduct((prev) => ({ ...prev, tags: selectedList.map(item => item.name) }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (product.productName.length < 5 || product.productName.length > 100) {
      newErrors.productName = "Product name should be 5–100 characters.";
    }

    const descriptionText = product.description.replace(/<[^>]+>/g, "");
    if (descriptionText.length < 10 || descriptionText.length > 1000) {
      newErrors.description = "Description should be 10–1000 characters.";
    }

    if (product.tags.length > 15)
      newErrors.tags = "Maximum 15 tags allowed.";

    if (!product.productCategory)
      newErrors.productCategory = "Select a product category";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await postProduct(product);
      if (response) {
        alert("Product saved successfully!");
        navigate("/dashboard");
      } else {
        alert("Failed to save product.");
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      alert("Something went wrong while saving the product.");
    }
  };

  return (
    <div>
      <Header showDashboardOnly={true}/>
    <div className="form-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="add-form">

        <label>Product Name</label>
        <input
          type="text"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          placeholder="Enter product name"
        />
        {error.productName && <p className="error">{error.productName}</p>}

        
        <label>Product Image</label>
        <input
          type="file"
          name="productImage"
          accept=".png,.jpg,.jpeg"
          multiple
          onChange={handleChange}
        />
        <div className="image-preview">
          {product.productImage.map((file, index) => (
            <div key={index} className="thumb">
              <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className="thumb-img"/>
              <button type="button" className="remove-img" onClick={() => handleRemoveImage(index)}>×</button>

            </div>
          ))}
        </div>

        <label>Price</label>
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Enter price"
        />

        
        <label>Description</label>
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          onChange={(event, editor)=>{
            const data = editor.getData();
            setEditorData(data);
            setProduct((prev) => ({ ...prev, description: data }));
          }}
        />
        {error.description && <p className="error">{error.description}</p>}

       
        <label>Tags</label>
        <Multiselect
          options={tagOptions} 
          selectedValues={product.tags.map(tag => ({ name: tag }))}
          onSelect={onSelect}
          onRemove={onRemove}
          displayValue="name"
          showCheckbox={true}
          placeholder="Select tags"
        />

 
        <label>Product Category</label>
        <select
          name="productCategory"
          value={product.productCategory}
          onChange={handleChange}
        >
          <option value=""></option>
          {category.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
        {error.productCategory && <p className="error">{error.productCategory}</p>}

       
        <button type="submit" className="submit-btn">
          Save Product
        </button>
      </form>

    
      <style>{`
        .form-container { max-width: 650px; margin: 40px auto; background: #fff; padding: 25px 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);}
        h2 { text-align:center; color:#333; margin-bottom:20px; }
        label { display:block; margin:10px 0 5px; font-weight:600; }
        input[type="text"], input[type="number"], input[type="file"], select { width:100%; padding:8px; border:1px solid #ccc; border-radius:6px; }
        .image-preview { display:flex; flex-wrap:wrap; gap:10px; margin-top:10px; }
        .thumb { position:relative; }
        .thumb-img { width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #ccc; }
        .remove-img { position:absolute; top:-6px; right:-6px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:14px; }
        .submit-btn { width:100%; background:#007bff; color:white; padding:10px; border:none; border-radius:8px; margin-top:15px; cursor:pointer; }
        .submit-btn:hover { background:#0056b3; }
        .error { color:red; font-size:14px; }
      `}</style>
    </div>
    </div>
  );
};

export default AddProduct;
