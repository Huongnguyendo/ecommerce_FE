import React, { useEffect } from 'react';
import { cartActions } from '../redux/actions/cart.actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

const CartScreen = () => {
  const params = useParams();
  const history = useHistory();
  const cart = useSelector(state => state.cart.cartItems);

  

  // const product = params.product;
  const product = window.location.pathname.split("/")[3]
  const quantity = window.location.search.split('quantity=')[1] ;
  console.log("product ne: ", product);
  console.log("quantity ne: ", quantity);
  console.log("cart ", cart);
  const dispatch = useDispatch();
  // const removeFromCartHandler = (product) => {
  //   dispatch(removeFromCart(product));
  // }
  useEffect(() => {
    if (product) {
      dispatch(cartActions.addToCart(product, quantity));
    }
  }, []);

  useEffect(() => {
    dispatch(cartActions.getCartItems());
  }, []);
  console.log("cart", cart);

  const checkoutHandler = () => {
    history.push("/signin?redirect=shipping");
  }

  return <div className="cart">
    <div className="cart-list">
      <ul className="cart-list-container">
        <li>
          <h3>
            Shopping Cart
          </h3>
          <div>
            Price
          </div>
        </li>
        {/* {
          cartItems.length === 0 ?
            <div>
              Cart is empty
          </div>
            :
            cartItems.map(item =>
              <li>
                <div className="cart-image">
                  <img src={item.image} alt="product" />
                </div>
                <div className="cart-name">
                  <div>
                    <Link to={"/product/" + item.product}>
                      {item.name}
                    </Link>

                  </div>
                  <div>
                    quantity:
                  <select value={item.quantity} onChange={(e) => dispatch(cartActions.addToCart(item.product, e.target.value))}>
                      {[...Array(item.countInStock).keys()].map(x =>
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      )}
                    </select>
                    <button type="button" className="button" onClick={() => removeFromCartHandler(item.product)} >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="cart-price">
                  ${item.price}
                </div>
              </li>
            )
        } */}
      </ul>

    </div>
    {/* <div className="cart-action">
      <h3>
        Subtotal ( {cartItems.reduce((a, c) => a + c.quantity, 0)} items)
        :
         $ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
      </h3>
      <button onClick={checkoutHandler} className="button primary full-width" disabled={cartItems.length === 0}>
        Proceed to Checkout
      </button>

    </div> */}

  </div>
}

export default CartScreen;