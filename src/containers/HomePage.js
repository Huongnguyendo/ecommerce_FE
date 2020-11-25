import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, FormControl } from "react-bootstrap";
import ProductCard from "components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { productActions, categoryActions } from "redux/actions";
import { useHistory, Link } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";
import Select from 'react-select';
import logo from "../images/shopping-cart.png"
import shoeimg from "../images/shoe.png";
import watchimg from "../images/apple-watch.png";
import iphoneimg from "../images/iphone-12-pro.png";
import slide1 from "../images/iphone-lineup.jpg"
import slide2 from "../images/ckeditor_2775444.jpg";
import cover from "../images/cover.jpg";
import bgi from "../images/download.jpeg"
import fashion from "../images/dress.png";
import phone from "../images/smartphone.png";
import tv from "../images/smart-tv.png";
import accessories from "../images/eyeglasses.png";
import health from "../images/healthcare.png";
import house from "../images/house.png"
import household from "../images/household.png";
import book from "../images/open-book.png";

const HomePage = () => {
  const history = useHistory();
  const [pageNum, setPageNum] = useState(1); 

  let [category, setCategory] = useState("");


  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  let productList = useSelector((state) => state.product.products);


  let loading = useSelector((state) => state.product.loading);

  
  const categories = [
    { value: 'All', label: 'All Categories'},
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Phones and Accessories', label: 'Phones & Accessories' },
    { value: 'Electronic device', label: 'Electronic device' },
    { value: 'Household goods', label: 'Household goods' },
    { value: 'Home and Life', label: 'Home & Life' },
    { value: 'Health and Life', label: 'Health & Life' },
    { value: 'Fashion Accessories', label: 'Fashion Accessories' },
    { value: 'Books', label: 'Books' },
  ]


  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const gotoProductDetail = (index) => {
    history.push(`/products/${index}`);
  };


  useEffect(() => {
    dispatch(productActions.getProductList( category, pageNum ));
  }, [dispatch, category, pageNum ]);


  
  // JS 
  let slideIndex = 0;
  let slider = document.getElementById('slider')
  let slides = slider?.getElementsByClassName('slide')
  let slideControl = document.getElementById('slide-control')
  let slideControlItems = slideControl?.getElementsByClassName('slide-control-item')


  setTimeout(() => {
    slideControlItems && slideControlItems[slideIndex].classList.add('active')
    slides && slides[slideIndex].classList.add('active')
  }, 500);

    return (
    <div>


      <div id="slider" className="slider">
        <div className="row fullheight slide">
          <div className="col-6">
            <div className="product-info">
              <div className="info-wrapper">
                <div className="homepageDeal left-to-right">
                  <h1 class="blink_me">
                    HOT ITEM THIS WEEK
                  </h1>
                </div>
                <div className="ctaBtn left-to-right">
                  <Button className="CTA">
                      <a href="#homePageProduct">SHOP NOW</a>
                    </Button>
                </div>
                
              </div>
            </div>

          </div>
          <div className="col-6">
            <div className="product-img">
              <div className="img-wrapper right-to-left">
                <div >
                  <img src={iphoneimg} alt="placeholder+image" />
                </div>
              </div>
            </div>
            
          </div>
        </div>        
      </div>

      <div className="container mt-3">
        <h2 className="homepageTitle" style={{paddingTop: "15px"}}>CATEGORY</h2>
        <div className="categorySelect">
          <div className="row">
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12" onClick={() =>setCategory("Fashion")}>
                <div className="innerCategoryItem">
                  <img src={fashion}/>
                </div>
                  <p>Fashion</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={() =>setCategory("Phones and Accessories")}>
                <div className="innerCategoryItem">
                  <img src={phone}/>
                </div>
                  <p>Phones and Accessories</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={() => setCategory("Electronic device")}>
                <div className="innerCategoryItem">
                  <img src={tv}/>
                </div>
                  <p>Electronic device</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={() => setCategory("Household goods")}>
                <div className="innerCategoryItem">
                  <img src={house}/>
                </div>
                  <p>Household goods</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={() => setCategory("Home and Life")}>
                <div className="innerCategoryItem">
                  <img src={household}/>
                </div>
                  <p>Home and Life</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={() => setCategory("Health and Life")}>
                <div className="innerCategoryItem">
                  <img src={health}/>
                </div>
                  <p>Health and Life</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={() => setCategory("Fashion Accessories")}>
                <div className="innerCategoryItem">
                  <img src={accessories}/>
                </div>
                  <p>Fashion Accessories</p>
              </div>
              <div className="categoryItem col-md-4 col-sm-4 col-xs-12"  onClick={ () => setCategory("Books")}>
          <div className="innerCategoryItem">
            <img src={book}/>
          </div>
            <p>Books</p>
        </div>
          </div>
        </div>
      </div>

      <div className="homePageProduct" id="homePageProduct">
        <div className="innerHomePageProduct">
              <h2 className="homepageTitle">PRODUCTS</h2>
              <div className="container">
                <div id="mainRow "
                  style={{display: "flex", flexWrap: "wrap", justifyContent: "center",}}>
                  {loading ? (
                    <h4 style={{ textAlign: "center", marginTop: "100px" }}>loading</h4>
                  ) 
                  
                  : 
                  (
                    productList && productList.map((product) => (
                      <ProductCard
                        product={product}
                        key={product._id}
                        gotoProductDetail={gotoProductDetail}
                      />
                    ))
                  )
                  }
                </div>
                  <PaginationBar
                  className="pagination"
                    pageNum={pageNum}
                    setPageNum={setPageNum}
                    totalPageNum={totalPageNum}
                    loading={loading}
                  />
              </div>
        </div>
      </div>

      <section id="support">
        <div className="container">
              <div className="support-area row">
                <div className="col-md-4 col-sm-4 col-xs-12">
                  <div className="support-single">
                    <span className="fa fa-truck" />
                    <h4>FREE SHIPPING</h4>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                  <div className="support-single">
                    <span className="fa fa-clock" />
                    <h4>30 DAYS MONEY BACK</h4>
                  </div>
                </div>
                <div className="col-md-4 col-sm-4 col-xs-12">
                  <div className="support-single">
                    <span className="fa fa-phone" />
                    <h4>SUPPORT 24/7</h4>
                  </div>
                </div>
              </div>
            
        </div>
      </section>

      <section className="footer_info">
        <div className="footer_info__items">
          <div className="footer_info__item about_us col-md-4 col-sm-4 col-xs-12">
            <p>About Us</p>
            <p>Latest player in the field</p>
          </div>
          
          <div className="footer_info__item info col-md-4 col-sm-4 col-xs-12">
            <p>Information</p>
            <a href="/">Home</a>
            <a href="/">Products</a>
            <a href="/">Mail us</a>
          </div>
          <div className="footer_info__item contact col-md-4 col-sm-4 col-xs-12">
            <p>Contact</p>
            {/* <p>
              <span />
            </p> */}
            <p>
              <i className="fa fa-phone" />
              <span className="ml-2">0123456789</span>
            </p>
            <p>
              <i className="fa fa-envelope" />
              <span className="ml-2">shopNow@gmail.com</span>
            </p>
          </div>
        </div>
      </section>

    <footer className="footer">
      <div className="footer__left">
        <p>Copyright</p>
      </div>
      <div className="footer__right">
        <i className="fab fa-cc-visa" />
        <i className="fab fa-cc-paypal" />
        <i className="fab fa-cc-mastercard" />
        <i className="fab fa-cc-amex" />
      </div>
    </footer>


    </div>
  );
};

export default HomePage;
