import React, {useEffect} from "react";
import { Nav } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image, Button} from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";

const SellerProductPage = () => {
  let dispatch = useDispatch();
  
  const selectedProducts = useSelector((state) => state.product?.products);
  const loading = useSelector((state) => state.product?.loading);
  // console.log("selectedProducts", selectedProducts.products);
  
  useEffect(() => {dispatch(productActions.getAllProductsForSeller())},[])
  console.log("Seller page ", selectedProducts);

  

  return (
      <div className>
        <Link to="/seller/products/add" className="d-flex justify-content-center">
            <Button variant="primary" className="mr-2">Add product</Button>
        </Link>

        {loading ? <h3>Loading...</h3> : 
          selectedProducts?.map((product) => (
          <div>
            {/* <Col sm={6} > */}
              
              <Link to={"/seller/products/edit/" + product._id} style={{textDecoration: "none"}}>
                  <div className="productCard" style={{borderRadius: "15px"}}>
                    <div>
                        <div className="productCardImg">
                            {product.image && (
                              <img src={product.image}  />
                            )}
                        </div>
                        <div className="productCardBody"
                          >
                          <Badge variant="warning" style={{fontSize: "12px"}}>{product.category}</Badge>
                          <h3 className="productCardName">{product.name}</h3>
                          <p className="productCardPrice" style={{paddingLeft: "10px"}}>${product.price}</p>
                          <div className="productCardDes-Btn">
                            <p className="productCardDescription">{product.description.length < 80 ? product.description : product.description.slice(0, 80) + "..."}</p>
                            <button 
                              className="productCardBtn" 
                              >DETAILS</button>
                          </div>
                        </div>
                    </div>
                    </div>
              </Link>
            {/* </Col> */}
          </div>
        
          
        ))
      }

    

        </div>
    );
};

export default SellerProductPage;

