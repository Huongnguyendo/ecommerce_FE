import React from "react";
import moment from "moment";
import user from "../images/defaultavapic.png";

const ReviewList = ({ reviews, setAverageRating }) => {
  let averageRating = 0;
  for (let i = 0; i < reviews?.length; i++) {
    averageRating += reviews[i].rating;
  }

  setAverageRating((averageRating / reviews?.length).toFixed(2));
  return (
    <>
      {reviews?.length > 0 && (
        <div
          className="productDetailRVlistInner"
          style={{ textAlign: "center" }}
        >
          <div className="ratingDiv">
            <h5 style={{ marginBottom: "10px" }}>Average Rating</h5>
            <div className="rating">
              {(averageRating / reviews?.length).toFixed(1)}
            </div>
            {reviews?.length > 1
              ? reviews?.length + " reviews "
              : reviews?.length + " review "}
          </div>
          <div className="list-unstyled">
            <h5 style={{ marginBottom: "15px" }}>Reviews</h5>
            {reviews.map((review) => (
              <ReviewContent key={review._id} review={review} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const ReviewContent = ({ review }) => {
  return (
    <div className="comment">
      <li>
        <div className="media" style={{ fontWeight: "400" }}>
          <div className="media-left">
            <img
              className="media-object"
              src={
                // {review?.user?.avatarUrl}
                user
              }
              style={{
                width: "30px",
                marginRight: "20px",
                borderRadius: "15px",
              }}
              alt="user"
            />
          </div>
          <div className="media-body">
            <small className="media-heading">{review?.user?.name} </small>
            <p className="aa-product-rating" style={{ marginBottom: "0" }}>
              <i className="fa fa-star" style={{ color: "orange" }}></i>{" "}
              {review?.rating}
              {" - "}
              <i>{review?.content}</i>
            </p>
            {/* <span><Moment fromNow>{review?.createdAt}</Moment></span></h5> */}
            <small>on {moment(review?.createdAt).format("DD/MM/YYYY")}</small>
          </div>
        </div>
      </li>
    </div>
  );
};

export default ReviewList;
