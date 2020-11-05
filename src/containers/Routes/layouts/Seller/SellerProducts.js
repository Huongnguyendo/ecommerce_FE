import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {productActions} from "../../../../redux/actions/product.actions";
import {Card, Badge, Row, Col, Image} from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";

const SellerProductPage = () => {
  let dispatch = useDispatch();
  
  const selectedProducts = useSelector((state) => state.product.products);


  return (
      <div>
    {/* <h1>Seller product page ne</h1> */}
    {selectedProducts.map((product) => (
        <Row>
    <Col sm={6} style={{ marginBottom: "20px", maxWidth: "320px" }}>
    {/* {console.log("product._id", product._id)}
    {console.log("product.seller", product.seller.name)} */}
    <Card>
      <Card.Body>
        
        <div
          style={{
            height: "200px",
            overflow: "scroll",
            textAlign: "left",
          }}
        >
          {/* Description: <Card.Text>{product.description}</Card.Text>{" "} */}
          {product.image && (
            <Image src={product.image} style={{ width: "80%" }} />
          )}
          <Card.Title
          style={{
            height: "50px",
            overflow: "hidden",
          }}
        //   onClick={() => {
        //     gotoProductDetail(product._id);
        //   }}
        >
          <Badge variant="warning">{product.category}</Badge>
          {product.name}
        </Card.Title>
        ${product.price}
        </div>
      </Card.Body>
      <Card.Footer>
        <small
          className="text-muted"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src={ product && product.seller &&
              product.seller.avatarUrl ? `${product.seller.avatarUrl}`
              : "../images/defaultavapic.png"}
            style={{ width: "30px", height: "25px", marginRight: "10px" }}
            roundedCircle
          />{" "}
          
          <div style={{ width: "fit-content", display: "flex" }}>
            
            Merchant: {product.seller?.name} 
          </div>
        </small>
      </Card.Footer>
    </Card>
  </Col>
        </Row>
      ))}

      
      </div>
    );
};

export default SellerProductPage;

