import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import {userActions} from "../../../../redux/actions/user.actions";
// import { useSelector, useDispatch } from "react-redux";

const AdminSideMenu = () => {
  let dispatch = useDispatch();
  // let seller = useSelector((state) => state.auth.isAuthenticated);

  const getAllUsers = () => {
    dispatch(userActions.getAllUsersForAdmin());
  }


  return (
    <div>
      <h1>Admin dashboard ne</h1>
      <Nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="sidebar-sticky pt-3">
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/admin/profile"
            activeClassName="active"
            strict={true}
          >
            Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/admin/users"
            activeClassName="active"
            strict={true}
            onClick={getAllUsers}
          >
            Users
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={NavLink}
            to="/admin/categories"
            activeClassName="active"
            strict={true}
          >
            Categories
          </Nav.Link>
        </Nav.Item>
        
      </div>
    </Nav>
    </div>
  );
};

export default AdminSideMenu;
