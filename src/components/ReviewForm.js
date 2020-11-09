import React from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";

const ReviewForm = ({
  reviewText,
  handleInputChange,
  handleSubmitReview,
  loading,
}) => {
  return (
      <Form onSubmit={handleSubmitReview}>
      <Form.Group as={Row}>
        <Form.Label htmlFor="review" column sm="2">
          {/* Review: */}
        </Form.Label>
        <Col sm="8">
          <Form.Control
            id="review"
            className="mt-5"
            type="text"
            value={reviewText}
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
          <Button className="mt-5" type="submit" disabled={!reviewText}>
            Submit
          </Button>
        )}
      </Form.Group>
    </Form>
  );
};

export default ReviewForm;