import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../../../redux/actions/user.actions";

const AdminSideMenu = () => {
  let dispatch = useDispatch();

  const getAllUsers = () => {
    dispatch(userActions.getAllUsersForAdmin());
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Admin Dashboard</h1>
      <div className="d-flex justify-content-center">
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
      </div>
    </div>
  );
};

export default AdminSideMenu;
