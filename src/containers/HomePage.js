import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, FormControl } from "react-bootstrap";
import ProductCard from "components/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import { productActions, categoryActions } from "redux/actions";
import { useHistory, Link } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";
import Select from 'react-select';
import shoeimg from "../images/shoe.png";
import watchimg from "../images/apple-watch.png";
import slide1 from "../images/iphone-lineup.jpg"
import slide2 from "../images/ckeditor_2775444.jpg";

const HomePage = () => {
  const history = useHistory();
  const [pageNum, setPageNum] = useState(1); 

  const [category, setCategory] = useState("All");
  const filterProducts = useSelector((state) => state.product.products)
  console.log("filterProducts: ", filterProducts );

  const totalPageNum = useSelector((state) => state.product.totalPageNum);
  let productList = useSelector((state) => state.product.products);
  let loading = useSelector((state) => state.product.loading);

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

  useEffect(() => {
    dispatch(categoryActions.getProductsWithCategory(category))
  }, [category, pageNum]);

  // JS 
  let slideIndex = 0;
  let slider = document.getElementById('slider')
  let slides = slider?.getElementsByClassName('slide')
  let slideControl = document.getElementById('slide-control')
  let slideControlItems = slideControl?.getElementsByClassName('slide-control-item')


  // slider?.style.marginTop = '-' + slideIndex + '00vh'

  setTimeout(() => {
    slideControlItems && slideControlItems[slideIndex].classList.add('active')
    slides && slides[slideIndex].classList.add('active')
  }, 500)
  

  return (
    <div>

      <Select className="categorySelect" options = {categories} onChange={(e) => setCategory(e.value)} />

      
      <div id="slider" className="slider">
        <div className="row fullheight slide">
          <div className="col-6 fullheight">
            <div className="product-info">
              <div className="info-wrapper">
                <div className="homepageDeal left-to-right">
                  <h2>
                    HOTDEAL THIS WEEK
                  </h2>
                </div>
                <div className="ctaBtn left-to-right">
                  <Button className="CTA" variant="danger">SHOP NOW</Button>
                </div>
                
              </div>
            </div>

          </div>
          <div className="col-6 fullheight img-col" style={{backgroundImage: 'linear-gradient(to top right, #e19e95, #fd835c)'}}>
            <div className="product-img">
              <div className="img-wrapper right-to-left">
                <div className="bounce">
                  <img src={shoeimg} alt="placeholder+image" />
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

      <h1 className="homepageTitle">PRODUCTS</h1>

      <Row id="mainRow"
        style={{display: "flex", flexWrap: "wrap", justifyContent: "center",}}>
        {loading ? (
          <h4 style={{ textAlign: "center" }}>loading</h4>
        ) : filterProducts ? (
          filterProducts?.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              gotoProductDetail={gotoProductDetail}
            />
          ))
        )
        : (
          productList?.map((product) => (
            <ProductCard
              product={product}
              key={product._id}
              gotoProductDetail={gotoProductDetail}
            />
          ))
        )}
      </Row>
      <PaginationBar
        pageNum={pageNum}
        setPageNum={setPageNum}
        totalPageNum={totalPageNum}
        loading={loading}
      />
    </div>
  );
};

export default HomePage;
