import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  ButtonGroup,
} from "react-bootstrap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { authActions } from "../../redux/actions/auth.actions";
// import { ClipLoader } from "react-spinners";

const ProfilePage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    avatarUrl: currentUser.avatarUrl,
  });
  const dispatch = useDispatch();

  let [avatarUrl, setAvatarUrl] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, avatarUrl } = formData;
    console.log("avatarUrl: ", avatarUrl);
    dispatch(authActions.updateProfile(name, avatarUrl));
    setEditable(false);
  };

  const handleCancel = () => {
    setEditable(false);
  };

  const uploadWidget = () => {
    console.log("hehehehheheheh")
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ["userAvatar"],
      },
      function (error, result) {
        console.log("hihihihihihihih")
        if (error) console.log("abcd ", error);
        if (result.event === "success") {
          console.log(result.info.secure_url)
          // console.log("heheheh: ", result[0].secure_url)
          setFormData({
            ...formData,
            avatarUrl: result.info.secure_url,
          });
        }
      }
    );
  };

  // const openWidget = () => {
  //   const widget = window.cloudinary.createUploadWidget(
  //     {
  //       cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  //       upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
  //     },
  //     (error, result) => {
  //       if (result.event === "success") {
  //         setAvatarUrl(result.info.secure_url);
  //       }
  //     }
  //   );
  //   widget.open(); // open up the widget after creation
  // };

  return (
    <div fluid className="userProfilePage">
      {/* <br />
      <Row>
        
        <Col className="d-flex justify-content-end align-items-start">
          <Button variant="primary" onClick={() => setEditable(true)}>
            Edit
          </Button>
        </Col>
      </Row>
      <br /> */}

      <Row className="d-flex justify-content-center align-items-center">
        <Col md={{ span: 8}}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              Loading...
              {/* <ClipLoader color="#f86c6b" size={150} loading={true} /> */}
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group>{console.log(formData.avatarUrl)}
                <div className="text-center">
                  {formData.avatarUrl && (
                    <div className="mb-3">
                      <img
                        src={formData.avatarUrl ? formData.avatarUrl : "https://lh3.googleusercontent.com/proxy/6XSzNgIYVLWue7bahUshLuO6MDh-7a-2iYWCmnIJnmMHcoOgj4r9Gn9pRHXotfaDyTIqid8Es0U8MHUqZpe2F4n0ImUbjlM"}
                        className="avatar-lg"
                        alt="avatar"
                      />
                    </div>
                  )}
                  <Button
                    variant="success"
                    className="btn-block w-100 mb-5"
                    onClick={() => setEditable(true)}
                  >
                    Edit info
                  </Button>

                  <Button
                    variant="info"
                    className="btn-block w-100 "
                    onClick={uploadWidget}
                    disabled={!editable}
                  >
                    Edit avatar
                  </Button>
                </div>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Name
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editable}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm="2">
                  Email
                </Form.Label>
                <Col>
                  <Form.Control
                    type="email"
                    required
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                  />
                </Col>
              </Form.Group>
              <br />
              {editable && (
                <ButtonGroup className="d-flex mb-3">
                  {loading ? (
                    <Button
                      className="mr-3"
                      variant="primary"
                      type="button"
                      disabled
                    >
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Submitting...
                    </Button>
                  ) : (
                    <Button className="mr-3" type="submit" variant="primary">
                      Submit
                    </Button>
                  )}
                  <Button
                    variant="light"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              )}
            </Form>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
