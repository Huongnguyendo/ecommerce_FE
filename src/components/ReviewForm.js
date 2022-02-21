import React from "react";
import { Form, Button } from "react-bootstrap";

const ReviewForm = ({
  reviewText,
  handleInputChange,
  handleSubmitReview,
  loading,
  rating,
  setRating,
}) => {
  return (
    <Form onSubmit={handleSubmitReview} style={{ marginBottom: "80px" }}>
      <Form.Group className="reviewForm" style={{ width: "100%" }}>
        <div
          htmlFor="review"
          className="reviewScore"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "0", marginRight: "10px" }}>
            <i className="fa fa-star" style={{ color: "orange" }}></i>
          </p>
          <select
            id="reviewNumber"
            className="select"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
            }}
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>
        <div style={{ display: "flex" }} className="reviewText">
          <Form.Control
            id="review"
            type="text"
            value={reviewText}
            placeholder="Leave a review"
            onChange={handleInputChange}
          />
          {loading ? (
            <Button variant="primary" type="button" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Submitting...
            </Button>
          ) : (
            <Button type="submit" disabled={!reviewText}>
              Submit
            </Button>
          )}
        </div>
      </Form.Group>
    </Form>
  );
};

export default ReviewForm;
