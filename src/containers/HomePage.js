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

const HomePage = () => {
  const history = useHistory();
  const [pageNum, setPageNum] = useState(1); 

  const [category, setCategory] = useState("All");
  
  
  // const filterProducts = useSelector((state) => state.category.products)
  // console.log("filterProducts: ", filterProducts );

  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  let productList = useSelector((state) => state.product.products);

  let loading = useSelector((state) => state.product.loading);
  console.log(productList, "List ststst")
  console.log(loading, "hehhhh")

  
  const categories = [
    { value: 'All', label: 'All Categories'},
    { value: 'Fashion', label: 'Fashion' },
    { value: 'Phones & Accessories', label: 'Phones & Accessories' },
    { value: 'Electronic device', label: 'Electronic device' },
    { value: 'Household goods', label: 'Household goods' },
    { value: 'Home & Life', label: 'Home & Life' },
    { value: 'Health & Life', label: 'Health & Life' },
    { value: 'Fashion Accessories', label: 'Fashion Accessories' },
    { value: 'Books', label: 'Books' },
  ]

  

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  const gotoProductDetail = (index) => {
    history.push(`/products/${index}`);
  };

  // let keyword = "";

  useEffect(() => {
    dispatch(productActions.getProductList(pageNum));
  }, [dispatch, pageNum]);

  // useEffect(() => {
  //   if (category) {
  //     console.log("Category ne: ", category);
  //     dispatch(categoryActions.getProductsWithCategory(category))
  //     console.log("eafsa")}
  // }, [category, pageNum]);

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

      <Select className="categorySelect" options = {categories} onChange={(e) => setCategory(e.value)} />

      {/* <img src={cover} style={{width: "100%"}}/> */}
      {/* <div className="col-lg-3 col-12 mt-2">
          <Select placeholder="Category" 
                  className="categorySelect" 
                  options = {categories} 
                  onChange={(e) => setCategory(e.value)} 
                  />
      </div> */}

      <div id="slider" className="slider">
        <div className="row fullheight slide">
          <div className="col-6">
            <div className="product-info">
              <div className="info-wrapper">
                <div className="homepageDeal left-to-right">
                  <h1 class="blink_me">
                    HOTDEAL THIS WEEK
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
          <div className="col-6" >
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



      {/* <section className="carousel d-flex mb-5">
        <div className="swiper-container">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <a className="swiper-slide-link" href="https://tix.vn/phim/2442-lich-chieu-diep-vien-sieu-lay">
                <img src={slide1} />
              </a>
            </div>
            <div className="swiper-slide">
              <a className="swiper-slide-link" href="hhttps://tix.vn/phim/2444-lich-chieu-ca-sau-tu-than">
                <img src={slide2} />
              </a>
            </div>
            <div className="swiper-slide">
              <a className="swiper-slide-link" href="https://tix.vn/phim/837-captain-america-civil-war">
                <img src="img/cover_4.jpg" />
                <i className="fa fa-play" />
              </a>
            </div>
            <div className="swiper-slide">
              <a className="swiper-slide-link" href="https://tix.vn/phim/2446-lich-chieu-mai-ben-em">
                <img src="img/cover_5.png" />
                <i className="fa fa-play" />
              </a>
            </div>
          </div>
          <div className="swiper-button-next" />
          <div className="swiper-button-prev" />
          <div className="swiper-pagination" />
        </div>
      </section>

       */}
      <div className="homePageProduct" id="homePageProduct">
        <div className="innerHomePageProduct">
          <h2 className="homepageTitle">PRODUCTS</h2>

          <div id="mainRow"
            style={{display: "flex", flexWrap: "wrap", justifyContent: "center",}}>
            {loading ? (
              <h4 style={{ textAlign: "center", marginTop: "100px" }}>loading</h4>
            ) 
            // : filterProducts ? (
            //   filterProducts?.map((product) => (
            //     <ProductCard
            //       product={product}
            //       key={product._id}
            //       gotoProductDetail={gotoProductDetail}
            //     />
            //   ))
            // )
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
          <div className="footer_info__item about_us">
            <p>About Us</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam eligendi cum nobis optio dolorum necessitatibus repudiandae veritatis sapiente quibusdam tenetur?</p>
          </div>
          <div className="footer_info__item my_account">
            <p>My Account</p>
            <a href="#">Check out</a>
            <a href="#">Login</a>
            <a href="#">Create Account</a>
          </div>
          <div className="footer_info__item info">
            <p>Information</p>
            <a href="#">Home</a>
            <a href="#">Products</a>
            <a href="#">Short Codes</a>
            <a href="#">Mail us</a>
          </div>
          <div className="footer_info__item contact">
            <p>Contact</p>
            <p>
              <span />
            </p>
            <p>
              <i className="fa fa-phone" />
              <span />
            </p>
            <p>
              <i className="fa fa-envelope" />
              <span />
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
