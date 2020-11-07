import React from "react";
import { Col, Card, Image, Badge } from "react-bootstrap";
import moment from "moment";
import "App.css";

const ProductCard = ({ product, gotoProductDetail }) => {
  return (
    product && (
      <div className="productCard" sm={3} >
        {/* {console.log("product._id", product._id)}
        {console.log("product.seller", product.seller.name)} */}
        <Card>
          <Card.Body>
            
            <div
                style={{overflow: "scroll",textAlign: "left"}}>
                {product.image && (
                  <Image src={product.image} style={{ width: "200px" }} />
                )}
                <Card.Title
                style={{paddingLeft: "10px"}}
                onClick={() => {
                  gotoProductDetail(product._id);}}>

                <Badge variant="warning" style={{fontSize: "10px"}}>{product.category}</Badge>
                <p className="productCardName">{product.name}</p>
              </Card.Title>
              <p className="productCardPrice" style={{paddingLeft: "10px"}}>${product.price}</p>
            </div>
          
          </Card.Body>
          
          {/* <div style={{ height: "30px"}}>
            <small
              className="text-muted"
              style={{display: "flex",alignItems: "center",}}>
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
          </div>

         */}
        </Card>
      </div>
    )
  );
};

export default ProductCard;
