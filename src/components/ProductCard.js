import React from "react";
import { Badge } from "react-bootstrap";
import "App.css";

const ProductCard = ({ product, gotoProductDetail }) => {
  return (
    product && (
      <div className="productCard" style={{ borderRadius: "15px" }}>
        <div
          onClick={() => {
            gotoProductDetail(product._id);
          }}
        >
          <div className="productCardImg">
            {product.image && <img src={product.image} />}
          </div>
          <div className="productCardBody">
            <Badge
              className="product"
              variant="warning"
              style={{ fontSize: "12px" }}
            >
              {product.category}
            </Badge>
            <h3 className="productCardName">{product.name}</h3>
            <p className="productCardPrice" style={{ paddingLeft: "10px" }}>
              ${product.price}
            </p>
            <div className="productCardDes-Btn">
              <p className="productCardDescription">
                {product.description.length < 50
                  ? product.description
                  : product.description.slice(0, 50) + "..."}
              </p>
              <button
                className="productCardBtn"
                onClick={() => {
                  gotoProductDetail(product._id);
                }}
              >
                DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
