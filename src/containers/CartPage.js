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
  
  let totalCartRevenue = 0;
  for(let i=0; i<cart.length; i++) {
    let item = cart[i];
    totalCartRevenue += parseInt(item?.quantity) * parseInt(item?.product?.price);
  }

  console.log("totalCartRevenue ", totalCartRevenue);

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
            <div>Cart is empty</div>
            
            :
          
            cart.map(item =>
              <div className="cart-item-row">
                
                {/* <div className="cart-image">
                  <img src={item.product?.image} alt="product" />
                </div>

                <div className="cart-name">
                  <div>
                    <Link to={"/products/" + item.product?._id}>
                      {item.product?.name}
                    </Link>
                </div>

                  <div>
                    Quantity: {item.quantity}
                  </div>

                  <div className="cart-price">
                    Price: ${item.product?.price}
                  </div>
                  <div className="cart-subtotal">
                    Sub total: ${(item.product?.price * item.quantity).toLocaleString()}
                  </div>
                  <Button variant="danger" type="button" className="button" onClick={() => removeFromCartHandler(item.product)} >
                      Delete
                  </Button>
                </div> */}

              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th />
                      <th />
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>SubTotal</th>
                      <th/>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><a className="remove" href="#"><fa className="fa fa-close" /></a></td>
                      <td><a className="cart-image" href="#"><img src={item.product?.image} alt="img" /></a></td>
                      <td><a className="cart-name" href="#">
                          <Link to={"/products/" + item.product?._id}>
                            {item.product?.name}
                          </Link></a>
                      </td>
                      <td className="cart-price">${item.product?.price}</td>
                      <td>{item.quantity}</td>
                      <td className="cart-subtotal">${(item.product?.price * item.quantity).toLocaleString()}</td>
                      <Button variant="danger" type="button" className="button mt-1" onClick={() => removeFromCartHandler(item.product)} >
                        Delete
                      </Button>
                    </tr>
                     
                  </tbody>
                </table>
              </div>
 
              </div>
            )
        }
        <div className="cartTotal">
          <p>Total: ${totalCartRevenue.toLocaleString()}</p>
          <Button variant="info" onClick={checkoutHandler}>Checkout</Button>
        </div>
      </div>

    </div>
    
  </div>
}

export default CartScreen;