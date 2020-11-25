import React, { useEffect, useState } from 'react';
import { cartActions } from '../redux/actions/cart.actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import {Table, Button, Modal} from "react-bootstrap";
import emptycart from "images/empty-cart.png";
import moment from "moment";
import Moment from "react-moment";
import { toast } from 'react-toastify';

const CartScreen = () => {
  const params = useParams();
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);
  let cart = useSelector(state => state.cart.cartItems);
  const isCheckedout = useSelector((state) => state.cart.isCheckedout);
  const loading = useSelector((state) => state.cart.loading);


  console.log("cart ", cart);
  const dispatch = useDispatch();

  /* for modal */
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const removeFromCartHandler = (product) => {
    dispatch(cartActions.removeFromCart(product));
  }
  // useEffect(() => {
  //   if (product) {
  //     dispatch(cartActions.addToCart(product, quantity));
  //   }
  // }, []);

  useEffect(() => {
    if(!isCheckedout) {
      dispatch(cartActions.getCartItems());
    }
  }, [isCheckedout]);

  const checkoutHandler = () => {
    try {
      
      dispatch(cartActions.checkOutCart());

      // if(isCheckedout) {
        handleShow();
      // }
      // {
      //   onClose: () =>  history.push('/'),
      // }
    } catch (error) {

    }
  }
  
  let totalCartRevenue = 0;
  for(let i=0; i<cart.length; i++) {
    let item = cart[i];
    totalCartRevenue += parseInt(item?.quantity) * parseInt(item?.product?.price);
  }


  return <>
  <div className="cart">


    <div className="cart-list">
      <div className="cart-list-container">
        
        { loading ? (
          <h3>Loading...</h3>
        ) :
          (cart.length === 0 || isCheckedout) ?
            <div className="d-flex justify-content-between emptyCart">
              <img src={emptycart} style={{margin: "auto"}}/>
            </div>
            
            :
          
            <div className="container">
              <div className="cart-item-row">

                <section style={{width: "100%"}}>
                  <div className="row">
                    <div className="col-lg-8">
                      <div className="mb-3">
                        <div className="pt-4 wish-list">
                          <h3 className="mb-4" style={{color: "#007bff"}}>Cart ({cart?.length} items)</h3>
                          {/* TO MAP */}
                          {
                            cart.map(item => (
                              <div className="row mb-4">
                                <div className="col-md-5 col-lg-3 col-xl-3">
                              <div className="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">
                                <img className="img-fluid w-100" src={item.product?.image} alt="Sample" />
                              </div>
                            </div>
                                <div className="col-md-7 col-lg-9 col-xl-9">
                                  <div>
                                    <div className="d-flex justify-content-between">
                                      <div>
                                        <h5>{item.product?.name}</h5>
                                        
                                      </div>
                                      <div>
                                        <div className="def-number-input number-input safari_only mb-0 w-100">
                                          <input className="quantity" min={0} name="quantity" value={item.quantity} type="number" />
                                        </div>
                                        
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div>
                                        <a href="#!" type="button"
                                        onClick={() => removeFromCartHandler(item.product)} 
                                        className="card-link-secondary small text-uppercase mr-3"
                                        style={{color: "red"}}>
                                          
                                          <i className="fas fa-trash-alt mr-1" /> Remove item </a>
                                      </div>
                                      <p className="mb-0">
                                        <span><strong id="summary">${(item.product?.price * item.quantity).toLocaleString()}</strong></span>
                                        </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          }
                          
                          {/* END TO MAP */}
                          <hr className="mb-4" />
                          
                          <p className="text-primary mb-0"><i className="fas fa-info-circle mr-1" /> Do not delay the purchase, adding
                            items to your cart does not mean booking them.</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="pt-4">
                          <h5 className="mb-4">Expected shipping delivery</h5>
                          <p className="mb-0"> 
                            {moment().add(3, 'days').calendar()}
                          </p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="pt-4">
                          <h5 className="mb-4">We accept</h5>
                          <img className="mr-2" width="45px" src="https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg" alt="Visa" />
                          <img className="mr-2" width="45px" src="https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg" alt="American Express" />
                          <img className="mr-2" width="45px" src="https://mdbootstrap.com/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg" alt="Mastercard" />
                          <img className="mr-2" width="45px" src="https://mdbootstrap.com/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png" alt="PayPal acceptance mark" />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <div className="pt-4">
                          <h5 className="mb-3">The total amount of</h5>
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                              Temporary amount
                              <span>${totalCartRevenue.toLocaleString()}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                              <span>VAT <span className="small" style={{color: "gray"}}>(tax free)</span></span>
                              <span>$0</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                              <div>
                                <strong>The total amount of</strong>
                                <strong>
                                  <p className="mb-0">(including VAT)</p>
                                </strong>
                              </div>
                              <span><strong>${totalCartRevenue.toLocaleString()}</strong></span>
                            </li>
                          </ul>
                          <button type="button" 
                              className="btn btn-primary btn-block"
                              onClick={()=>checkoutHandler()}
                              >
                                Checkout
                            </button>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="pt-4">
                          <a className="dark-grey-text d-flex justify-content-between" data-toggle="collapse" href="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                            Add a discount code (optional)
                            <span><i className="fas fa-chevron-down pt-1" /></span>
                          </a>
                          <div className="collapse" id="collapseExample">
                            <div className="mt-3">
                              <div className="md-form md-outline mb-0">
                                <input type="text" disabled id="discount-code" className="form-control font-weight-light" placeholder="You have no discount code" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

              
              </div>
            </div>
        
        
        }

          {/* <div className="cartTotal">
              <p>Total: ${totalCartRevenue.toLocaleString()}</p>
              {totalCartRevenue > 0 ? 
              <Button variant="info" onClick={checkoutHandler}>Checkout</Button> :
              <Button variant="info" disabled onClick={checkoutHandler}>Checkout</Button>}
              
          </div> */}

        
         
       

      </div>

    </div>
    
  </div>
   <Modal show={show} onHide={handleClose}>
   <Modal.Header closeButton>
     <Modal.Title>Hi {user?.name}</Modal.Title>
   </Modal.Header>
   <Modal.Body>Thanks for buying with us!</Modal.Body>
   <Modal.Footer>
     <Button variant="success" onClick={handleClose}>
       Close
     </Button>
   </Modal.Footer>
 </Modal>
 </>
}

export default CartScreen;