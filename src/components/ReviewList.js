import React from "react";
import Moment from "react-moment";

const ReviewList = ({ reviews, loading }) => {
  return (
    <>
      {reviews?.length > 0 && (
        <ul className="list-unstyled">
          <h3>{reviews?.length} reviews for this product</h3>
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
        <li>
          <div className="media">
            <div className="media-left">
                <img className="media-object" src={review?.user?.avatarUrl} style={{width: "50px", marginRight: "30px"}}/>
            </div>
            <div className="media-body">
              <div className="aa-product-rating">
                <i class="fa fa-star"></i>{" "}{review?.rating}{"  "}
                <i>{review?.content}</i>
              </div>
              <h4 className="media-heading"><strong>{review?.user?.name} </strong> -  
              <span><Moment fromNow>{review?.createdAt}</Moment></span></h4>
            </div>
          </div>
        </li>
      
    </div>
  );
};

export default ReviewList;