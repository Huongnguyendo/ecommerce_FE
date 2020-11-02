import React from "react";
import Moment from "react-moment";

const ReviewList = ({ reviews, loading }) => {
  return (
    <>
      {reviews?.length > 0 && (
        <ul className="list-unstyled">
          {reviews.map((review) => (
            <ReviewContent key={review._id} review={review} 
            loading={loading}/>
          ))}
        </ul>
      )}
    </>
  );
};

const ReviewContent = ({ review, loading }) => {
  return (
    <div className="comment">
      <span><i class="fa fa-star"></i>{review?.rating}</span>{" "}
      <span className="comment_body">{review?.content}</span>
      <br />
      <span className="comment_by">posted by </span>
      <span className="comment_author">{review?.user?.name} </span>
      {/* <span className="comment_on"> on </span> */}
      <span className="comment_date">
        <Moment fromNow>{review?.createdAt}</Moment>
      </span>
      
    </div>
  );
};

export default ReviewList;