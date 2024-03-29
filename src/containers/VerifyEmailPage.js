import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../redux/actions";
import { Container, Row, Col } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import { routeActions } from "../../redux/actions/route.actions";

const VerifyEmailPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const redirectTo = useSelector((state) => state.route.redirectTo);

  useEffect(() => {
    if (params?.code && params.code !== "_" && !isAuthenticated && !loading) {
      dispatch(authActions.verifyEmail(params.code));
    }
  }, [dispatch, params, loading, isAuthenticated]);

  useEffect(() => {
    if (redirectTo) {
      if (redirectTo === "__GO_BACK__") {
        history.goBack();
        dispatch(routeActions.removeRedirectTo());
      } else {
        history.push(redirectTo);
        dispatch(routeActions.removeRedirectTo());
      }
    }
  }, [dispatch, history, redirectTo]);

  return (
    <Container fluid>
      <Row className="vh-100">
        <Col md={{ span: 6, offset: 3 }}>
          <br />
          <div className="text-center h-75 d-flex flex-row justify-content-center align-items-center">
            {loading ? (
              <ClipLoader color="#f86c6b" size={150} loading={true} />
            ) : (
              <>
                {params?.code === "_" ? (
                  <div>
                    <h3 className="text-primary">Please verify your email</h3>
                    <p className="lead">
                      You're almost there! We sent an email to you. Just click
                      on the link in that email to complete your signup.
                    </p>
                  </div>
                ) : (
                  <>
                    <div></div>
                  </>
                )}
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmailPage;