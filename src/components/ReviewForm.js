import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const ReviewForm = ({
  reviewText,
  handleInputChange,
  handleSubmitReview,
  loading,
  rating,
  setRating,
}) => {
  return (
    <Form onSubmit={handleSubmitReview}>
      <Form.Group as={Row}>
        <Col
          htmlFor="review"
          sm="2"
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: "0" }}>Rating</p>
          <select
            id="reviewNumber"
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
        </Col>
        <Col sm="6">
          <Form.Control
            id="review"
            type="text"
            value={reviewText}
            placeholder="Leave a review"
            onChange={handleInputChange}
          />
        </Col>
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
      </Form.Group>
    </Form>
  );
};

export default ReviewForm;
