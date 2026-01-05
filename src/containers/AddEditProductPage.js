import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { productActions, routeActions } from "../redux/actions";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  ButtonGroup,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const glassStyle = {
  background: 'rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
  backdropFilter: 'blur(8px)',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#222',
  p: { xs: 2, sm: 4 },
  maxWidth: 520,
  mx: 'auto',
  mt: 7,
};

const categories = [
  "Fashion",
  "Phones and Accessories",
  "Electronic device",
  "Household goods",
  "Home and Life",
  "Health and Life",
  "Fashion Accessories",
  "Books",
];

const darkBg = '#181c24';
const cardBg = '#23283a';
const cardShadow = '0 2px 12px 0 rgba(0,0,0,0.18)';
const textPrimary = '#fff';
const textSecondary = '#b0b8c1';
const accent = '#6c63ff';
const accent2 = '#00e6d0';

const AddEditProductPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    brand: "",
    price: 0,
    category: "",
    inStockNum: 0,
  });
  const loading = useSelector((state) => state.product.loading);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const selectedProduct = useSelector((state) => state.product.selectedProduct);
  const redirectTo = useSelector((state) => state.route.redirectTo);
  const addOrEdit = params.id ? "Edit" : "Add";
  const productId = params.id;
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    if (productId) {
      if (!selectedProduct) {
        dispatch(productActions.getProductDetailForSeller(productId));
      } else {
        setFormData((formData) => ({
          ...formData,
          name: selectedProduct?.name,
          description: selectedProduct?.description,
          image: selectedProduct?.image,
          brand: selectedProduct?.brand,
          price: selectedProduct?.price,
          category: selectedProduct?.category,
          inStockNum: selectedProduct?.inStockNum,
        }));
      }
    }
  }, [productId, selectedProduct, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, description, image, brand, price, category, inStockNum } = formData;
    if (addOrEdit === "Add") {
      dispatch(
        productActions.createNewProduct(
          name,
          description,
          image,
          brand,
          price,
          category || "Fashion",
          inStockNum
        )
      );
      history.push(`/seller/products`);
    } else if (addOrEdit === "Edit") {
      dispatch(
        productActions.updateProduct(
          selectedProduct?._id,
          name,
          description,
          image,
          brand,
          price,
          category,
          inStockNum
        )
      );
    }
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleDelete = () => {
    dispatch(productActions.deleteProduct(selectedProduct._id, "/"));
  };

  useEffect(() => {
    if (redirectTo) {
      if (redirectTo === "__GO_BACK__") {
        history.goBack();
        dispatch(routeActions.removeRedirectTo());
      } else {
        history.push(redirectTo);
        dispatch(routeActions.removeRedirectTo());
      }
    }
  }, [redirectTo, dispatch, productId]);

  const uploadWidget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ["productImg"],
      },
      function (error, result) {
        if (error && process.env.NODE_ENV === 'development') {
          console.log(error);
        }
        if (result.event === "success") {
          setFormData({
            ...formData,
            image: result.info.secure_url,
          });
        }
      }
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', background: darkBg, py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 3, letterSpacing: 1, color: accent }}>
        {addOrEdit} Product
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        {formData.image ? (
          <Box sx={{ mb: 2 }}>
            <img src={formData.image} alt="Product" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 12, boxShadow: cardShadow }} />
          </Box>
        ) : null}
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={uploadWidget}
          sx={{ borderRadius: 2, fontWeight: 500 }}
        >
          {formData.image ? 'Change Image' : 'Upload Image'}
        </Button>
      </Box>
      <Box component="form" onSubmit={handleSubmit} autoComplete="off" sx={{ width: '100%', maxWidth: 440, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2, background: cardBg, color: textPrimary, borderRadius: 3, boxShadow: cardShadow, p: 4 }}>
        <TextField
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 1, input: { color: textPrimary }, label: { color: textSecondary } }}
          InputLabelProps={{ style: { color: textSecondary } }}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          fullWidth
          multiline
          minRows={4}
          variant="outlined"
          sx={{ borderRadius: 1, input: { color: textPrimary }, label: { color: textSecondary } }}
          InputLabelProps={{ style: { color: textSecondary } }}
        />
        <TextField
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 1, input: { color: textPrimary }, label: { color: textSecondary } }}
          InputLabelProps={{ style: { color: textSecondary } }}
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          select
          fullWidth
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: { minWidth: 340 },
              },
            },
          }}
          variant="outlined"
          sx={{ borderRadius: 1, input: { color: textPrimary }, label: { color: textSecondary } }}
          InputLabelProps={{ style: { color: textSecondary } }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          required
          fullWidth
          variant="outlined"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{ borderRadius: 1, input: { color: textPrimary }, label: { color: textSecondary } }}
          InputLabelProps={{ style: { color: textSecondary } }}
        />
        <TextField
          label="Stock Quantity"
          name="inStockNum"
          value={formData.inStockNum}
          onChange={handleChange}
          type="number"
          required
          fullWidth
          variant="outlined"
          sx={{ borderRadius: 1, input: { color: textPrimary }, label: { color: textSecondary } }}
          InputLabelProps={{ style: { color: textSecondary } }}
        />
        <ButtonGroup fullWidth sx={{ mt: 4 }}>
          <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 600, borderRadius: 2 }}>
            {addOrEdit === "Add" ? "Add Product" : "Save Changes"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ fontWeight: 600, borderRadius: 2 }}>
            Cancel
          </Button>
          {addOrEdit === "Edit" && (
            <Button variant="outlined" color="error" onClick={handleDelete} sx={{ fontWeight: 600, borderRadius: 2 }}>
              Delete
            </Button>
          )}
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default AddEditProductPage;
