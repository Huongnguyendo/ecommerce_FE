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
  // console.log("selectedProducts", selectedProducts);
  
  useEffect(() => {dispatch(productActions.getAllProductsForSeller())},[])

  return (
      <div>
        <Link to="/seller/products/add" className="d-flex justify-content-center">
            <Button variant="primary" className="mr-2">Add product</Button>
        </Link>

        {loading ? <h3>Loading...</h3> : 
        selectedProducts?.products?.map((product) => (
          <Row className="d-flex justify-content-center align-items-center">
            <Col sm={6} >
              
              <Link to={"/seller/products/edit/" + product._id} style={{textDecoration: "none"}}>
                <Card>
                  <Card.Body>
                  <div
                    style={{overflow: "scroll",textAlign: "left"}}>
                    {product?.image && (
                      <Image src={product?.image} />
                    )}
                     <Card.Title>
                      <Badge variant="warning" style={{fontSize: "10px"}}>{product.category}</Badge>
                      
                          <p>{product?.name}</p>
                      
                    </Card.Title>
                  <p className="productCardPrice" style={{paddingLeft: "10px"}}>${product.price}</p>
                </div>
              
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          </Row>
        ))
      }

    

        </div>
    );
};

export default SellerProductPage;

