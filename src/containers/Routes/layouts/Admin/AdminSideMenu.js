import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const AdminSideMenu = () => {
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
          >
            Users
          </Nav.Link>
        </Nav.Item>
      </div>
    </div>
  );
};

export default AdminSideMenu;
