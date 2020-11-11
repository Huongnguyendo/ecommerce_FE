import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

const ReviewForm = ({
  reviewNumber,
  reviewText,
  handleInputChange,
  handleSubmitReview,
  loading,
}) => {
  return (
      <Form onSubmit={handleSubmitReview}>
      <Form.Group as={Row}>
        <Col htmlFor="review" sm="2">
          {/* <Form.Control
              id="reviewNumber"
              type="number"
              value={reviewNumber}
              placeholder="rating"
              onChange={handleInputChange}
            /> */}
        </Col>
        <Col sm="6">
          <Form.Control
            id="review"
            // className="mt-5"
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