import React from "react";
import { Row, Col, Image } from "react-bootstrap";

const NotFoundPage = () => {
  return (
    <div>
      <Row style={{ marginTop: "50px" }}>
        <Col md={{ span: 6, offset: 3 }} style={{ textAlign: "center" }}>
          <h1>404</h1>
          <p>The Page You Requested Could Not Be Found.</p>
          <Image
            src="../../images/error.png"
            alt="errorimg"
            style={{ width: "100%", marginTop: "50px" }}
          />
        </Col>
      </Row>
    </div>
  );
};
export default NotFoundPage;
