import React from "react";
import moment from "moment";
import user from "../images/defaultavapic.png";

const ReviewList = ({ reviews, loading, setAverageRating }) => {
  let averageRating = 0;
  for(let i = 0; i < reviews?.length; i++) {
    averageRating += reviews[i].rating;
  }

  setAverageRating((averageRating/(reviews?.length)).toFixed(2));
  return (
    <>
      {reviews?.length > 0 && (
        <div>
          <h4>{reviews?.length} reviews for this product</h4>
          <div className="list-unstyled">
            {reviews.map((review) => (
              <ReviewContent key={review._id} review={review} 
              loading={loading} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const ReviewContent = ({ review, loading }) => {
  
  return (
    <div className="comment" >
        <li>
          <div className="media" style={{fontWeight: "400"}}>
            <div className="media-left">
                <img className="media-object" src=
                // {review?.user?.avatarUrl}
                {user}
                style={{width: "30px", marginRight: "20px", borderRadius: "15px"}}/>
            </div>
            <div className="media-body">
              <span className="aa-product-rating">
                <i className="fa fa-star" style={{color: "orange"}}></i>{" "}{review?.rating}{"  "}
                <i>{review?.content}</i>
              </span>
              <span className="media-heading mx-3">{review?.user?.name} </span> - {" "}
              {/* <span><Moment fromNow>{review?.createdAt}</Moment></span></h5> */}
              <span>{moment(review?.createdAt).format("DD/MM/YYYY")}</span>
            </div>
          </div>
        </li>
      
    </div>
  );
};

export default ReviewList;