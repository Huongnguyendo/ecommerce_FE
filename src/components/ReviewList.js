import React from "react";
import moment from "moment";
import user from "../images/defaultavapic.png";
import { Box, Paper, Typography, Avatar, Stack, Rating, Chip, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const ReviewList = ({ reviews, setAverageRating }) => {
  let averageRating = 0;
  for (let i = 0; i < reviews?.length; i++) {
    averageRating += reviews[i].rating;
  }

  // Handle case when there are no reviews
  if (!reviews?.length) {
    setAverageRating(0);
    return null;
  }
  
  const calculatedAverage = (averageRating / reviews.length).toFixed(2);
  setAverageRating(calculatedAverage);
  const avg = (averageRating / reviews.length).toFixed(1);

  // Generate review tags based on rating
  const getReviewTags = (rating) => {
    const tags = [];
    if (rating >= 4.5) {
      tags.push("Excellent", "Highly Recommended", "Great Value");
    } else if (rating >= 3.5) {
      tags.push("Good", "Satisfied", "Worth It");
    } else if (rating >= 2.5) {
      tags.push("Average", "Okay", "Could Be Better");
    } else {
      tags.push("Disappointed", "Not Recommended", "Poor Quality");
    }
    return tags;
  };

  return (
    <Stack spacing={3}>
      {reviews.map((review) => {
        const tags = getReviewTags(review.rating);
        const ratingText = review.rating >= 4.5 ? "Excellent" : 
                          review.rating >= 3.5 ? "Good" : 
                          review.rating >= 2.5 ? "Average" : "Poor";
        
        return (
          <Paper
            key={review._id}
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: '#fff',
              border: '1px solid #e0e0e0',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderColor: '#00bfae'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
              {/* Avatar */}
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  bgcolor: '#00bfae',
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                {(review?.user?.name || 'A').charAt(0).toUpperCase()}
              </Avatar>
              
              {/* Review Content */}
              <Box sx={{ flex: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#222' }}>
                    {review?.user?.name || 'Anonymous User'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {moment(review?.createdAt).fromNow()}
                  </Typography>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        sx={{
                          color: star <= review.rating ? '#ffc107' : '#e0e0e0',
                          fontSize: 20
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body1" fontWeight={600} sx={{ color: '#00bfae' }}>
                    {ratingText}
                  </Typography>
                </Box>

                {/* Review Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        bgcolor: '#f5f5f5',
                        color: '#666',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        '&:hover': {
                          bgcolor: '#e0f7fa',
                          color: '#00bfae'
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* Review Text */}
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#333',
                    lineHeight: 1.6,
                    fontSize: '1rem'
                  }}
                >
                  {review?.content}
                </Typography>

              </Box>
            </Box>
          </Paper>
        );
      })}
    </Stack>
  );
};

export default ReviewList;
