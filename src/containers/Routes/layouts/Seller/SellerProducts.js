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
  
  useEffect(() => {dispatch(productActions.getAllProductsForSeller())},[])

  

  return (
      <div>
        <div  className="d-flex justify-content-center">
            <Link to="/seller/products/add">
                <Button className="my-5 mx-2 w-40 addProductBtn">Add Product</Button>
            </Link>

            <Link to="/seller/history">
                <Button className="my-5 mx-2 w-40 addProductBtn">Selling History</Button>
            </Link>
        </div>
        
      <div className="sellerAllProducts row">
          {loading ? <h3>Loading...</h3> : selectedProducts?.length == 0 ? <h3 style={{textAlign: "center", backgroundColor: "rgb(243, 243, 243)"}}>Begin selling by adding products</h3> :
            selectedProducts?.map((product) => (
            <div className="sellerProductItem col-md-6 col-sm-6 col-xs-12">
              {/* <Col sm={6} > */}
                
                <Link to={"/seller/products/edit/" + product._id} style={{textDecoration: "none"}}>
                    <div className="productCard float-left" style={{borderRadius: "15px"}}>
                      {/* <div> */}
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
                      {/* </div> */}
                      </div>
                </Link>
              {/* </Col> */}
            </div>
          
            
          ))
        }
      </div>

    

        </div>
    );
};

export default SellerProductPage;

