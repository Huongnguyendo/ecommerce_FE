import React, { useEffect } from 'react';
import { cartActions } from '../redux/actions/cart.actions';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import {Table, Button} from "react-bootstrap";

const CartScreen = () => {
  const params = useParams();
  const history = useHistory();
  const cart = useSelector(state => state.cart.cartItems);


  console.log("cart ", cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (product) => {
    dispatch(cartActions.removeFromCart(product));
  }
  // useEffect(() => {
  //   if (product) {
  //     dispatch(cartActions.addToCart(product, quantity));
  //   }
  // }, []);

  useEffect(() => {
    dispatch(cartActions.getCartItems());
  }, []);

  const checkoutHandler = () => {
    dispatch(cartActions.checkOutCart());
  }
//   let totalCost = cart.length && cart.reduce(function(item1, item2){
//     return (item1.quantity * item1.product.price) + (item2.quantity * item2.product.price);
// }, 0);
// console.log("total: ", totalCost);

  return <div className="cart">
{/* <Table striped bordered hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Product</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Larry the Bird</td>
      <td>@twitter</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
  </tbody>
</Table> */}

    <div className="cart-list">
      <div className="cart-list-container">
        
        {
          cart.length === 0 ?
            <div>
              Cart is empty
          </div>
            :
            
            cart.map(item =>
              <div className="cart-item-row">
                <div className="cart-image">
                  <img src={item.product.image} alt="product" />
                </div>

                <div className="cart-name">
                  <div>
                    <Link to={"/products/" + item.product._id}>
                      {item.product.name}
                    </Link>
                </div>

                  <div>
                    Quantity: {item.quantity}
                  {/* <select value={item.quantity} onChange={(e) => dispatch(cartActions.addToCart(item.product, e.target.value))}>
                      {[...Array(item.countInStock).keys()].map(x =>
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      )}
                    </select> */}
                    
                  </div>
                  <div className="cart-price">
                  Price: ${item.product.price}
                  </div>
                  <div className="cart-subtotal">
                    Sub total: ${(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  <Button variant="danger" type="button" className="button" onClick={() => removeFromCartHandler(item.product)} >
                      Delete
                  </Button>
                </div>
                
              </div>
            )
        }
        <Button variant="info" onClick={checkoutHandler}>Checkout</Button>
      </div>

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