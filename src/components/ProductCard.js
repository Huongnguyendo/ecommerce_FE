import React, {useState} from "react";
import { Col, Card, Image, Badge } from "react-bootstrap";
import moment from "moment";
import "App.css";

const ProductCard = ({ product, gotoProductDetail }) => {

  return (
    product && (
      <div className="productCard" style={{borderRadius: "15px"}}>
        {/* {console.log("product._id", product._id)}
        {console.log("product.seller", product.seller.name)} */}
        <div>
                <div className="productCardImg">
                    {product.image && (
                      <img src={product.image}  />
                    )}
                </div>
                <div className="productCardBody"
                
                  onClick={() => {
                    gotoProductDetail(product._id);}}>

                  <Badge variant="warning" style={{fontSize: "12px"}}>{product.category}</Badge>
                  <h3 className="productCardName">{product.name}</h3>
                  <p className="productCardPrice" style={{paddingLeft: "10px"}}>${product.price}</p>
                  <div className="productCardDes-Btn">
                    <p className="productCardDescription">{product.description.length < 80 ? product.description : product.description.slice(0, 80) + "..."}</p>
                    <button 
                      className="productCardBtn" 
                      onClick={() => {
                      gotoProductDetail(product._id);}}>DETAILS</button>
                  </div>
                </div>
          
          
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
        </div>
      </div>
    
    )
  );
};

export default ProductCard;
