import React from "react";
import { Col, Card, Image, Badge } from "react-bootstrap";
import moment from "moment";
import "App.css";

const ProductCard = ({ product, gotoProductDetail }) => {
  return (
    product && (
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
              onClick={() => {
                gotoProductDetail(product._id);
              }}
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
                src={ 
                  product.seller.avatarUrl === ""
                    ? "../images/defaultavapic.png"
                    : `${product.seller.avatarUrl}`
                }
                style={{ width: "30px", height: "25px", marginRight: "10px" }}
                roundedCircle
              />{" "}
              
              <div style={{ width: "fit-content", display: "flex" }}>
                
                Merchant: {product.seller.name} 
              </div>
            </small>
          </Card.Footer>
        </Card>
      </Col>
    )
  );
};

export default ProductCard;
